async function initDestinationPage() {
  const tabs = document.getElementById("destinationTabs");
  if (!tabs) return;
  const params = new URLSearchParams(window.location.search);
  const routeId = Number(params.get("id") || "1");
  try {
    const route = await apiRequest("/routes/" + routeId);
    const reviews = await apiRequest("/reviews?routeId=" + routeId);
    renderDestination(route, reviews);
    setupReviewCreate(routeId);
    setupReviewDelete();
  } catch (error) {
    showToast("Не удалось загрузить страницу маршрута");
  }
}

function renderDestination(route, reviews) {
  const titleEl = document.querySelector("h1.h3");
  const descEl = document.querySelector("section.bg-dark p.mb-3");
  const heroImage = document.querySelector("section.bg-dark img");
  const badges = document.querySelectorAll("section.bg-dark .badge");
  const attractionsRow = document.querySelector("#attractions .row.g-4");
  const recList = document.querySelector("#attractions .list-group");
  const reviewsRow = document.querySelector("#reviews .row.g-4");
  const mapBlock = document.querySelector("#map .ratio");
  const currentUser = getCurrentUser();
  if (titleEl) titleEl.textContent = route.title;
  if (descEl) descEl.textContent = route.description;
  if (heroImage && route.image) {
    heroImage.src = route.image;
    heroImage.alt = route.title;
  }
  if (badges[0]) {
    badges[0].innerHTML =
      iconSprite("buildings", "me-1") + " " + (route.type === "nature" ? "Природа" : "Город");
  }
  if (badges[1]) {
    badges[1].innerHTML = iconSprite("clock", "me-1") + " " + route.durationDays + " дня";
  }
  if (badges[2]) {
    badges[2].innerHTML =
      iconSprite("currency-ruble", "me-1") +
      " ~" +
      Number(route.budget).toLocaleString("ru-RU") +
      " ₽";
  }
  if (attractionsRow && Array.isArray(route.attractions)) {
    attractionsRow.innerHTML = route.attractions
      .map(
        (item) =>
          '<div class="col-md-4"><div class="card tripatropa-card h-100"><div class="card-body"><h5 class="card-title">' +
          escapeHtml(item.name) +
          '</h5><p class="card-text text-muted-sm">' +
          escapeHtml(item.description) +
          '</p><span class="badge bg-primary-subtle text-primary">' +
          escapeHtml(item.day) +
          "</span></div></div></div>"
      )
      .join("");
  }
  if (recList && Array.isArray(route.recommendations)) {
    recList.innerHTML = route.recommendations
      .map((item) => '<li class="list-group-item">' + escapeHtml(item) + "</li>")
      .join("");
  }
  if (reviewsRow) {
    reviewsRow.innerHTML = reviews
      .map((review) => buildReviewCardHtml(review, currentUser))
      .join("");
  }
  if (mapBlock && route.map && route.map.lat && route.map.lng) {
    const lat = Number(route.map.lat);
    const lng = Number(route.map.lng);
    const delta = 0.05;
    const left = lng - delta;
    const right = lng + delta;
    const top = lat + delta;
    const bottom = lat - delta;
    const src =
      "https://www.openstreetmap.org/export/embed.html?bbox=" +
      encodeURIComponent(left + "," + bottom + "," + right + "," + top) +
      "&layer=mapnik&marker=" +
      encodeURIComponent(lat + "," + lng);
    mapBlock.classList.remove("d-flex", "align-items-center", "justify-content-center", "bg-light");
    mapBlock.innerHTML =
      '<iframe title="Карта маршрута" src="' +
      src +
      '" style="width:100%;height:100%;border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
  }
}

function renderStars(rating) {
  const rounded = Math.max(0, Math.min(5, Number(rating) || 0));
  let html = "";
  for (let i = 1; i <= 5; i += 1) {
    html += i <= rounded ? iconSprite("star-fill", "") : iconSprite("star", "");
  }
  return html;
}

function buildReviewCardHtml(review, currentUser) {
  const currentUserId = currentUser ? Number(currentUser.id) : null;
  const reviewAuthorId = review.authorId != null ? Number(review.authorId) : null;
  const canDelete = currentUserId !== null && reviewAuthorId === currentUserId;
  const deleteButton = canDelete
    ? '<button type="button" class="btn btn-outline-danger btn-sm" data-delete-review-id="' +
      review.id +
      '">Удалить</button>'
    : "";
  return (
    '<div class="col-md-4" data-review-id="' +
    review.id +
    '"><div class="card tripatropa-card h-100"><div class="card-body"><div class="d-flex justify-content-between mb-1"><span class="fw-semibold">' +
    escapeHtml(review.author) +
    '</span><span class="text-warning">' +
    renderStars(review.rating) +
    '</span></div><p class="text-muted-sm mb-2">' +
    escapeHtml(review.text) +
    "</p>" +
    deleteButton +
    "</div></div></div>"
  );
}

function setupReviewCreate(routeId) {
  const reviewsPane = document.getElementById("reviews");
  if (!reviewsPane) return;
  if (reviewsPane.querySelector("[data-review-create]")) return;
  const formHtml =
    '<div class="card tripatropa-card mb-3" data-review-create>' +
    '<div class="card-body">' +
    '<h2 class="h6 mb-2">Добавить отзыв</h2>' +
    '<div class="row g-2 align-items-end">' +
    '<div class="col-md-7"><label class="form-label mb-1">Текст</label><input type="text" class="form-control" id="reviewTextInput" placeholder="Краткий отзыв" /></div>' +
    '<div class="col-md-3"><label class="form-label mb-1">Оценка</label><select class="form-select" id="reviewRatingInput"><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option></select></div>' +
    '<div class="col-md-2 d-grid"><button class="btn btn-primary" id="addReviewBtn" type="button">Добавить</button></div>' +
    "</div>" +
    "</div>" +
    "</div>";
  reviewsPane.insertAdjacentHTML("afterbegin", formHtml);
  const addBtn = document.getElementById("addReviewBtn");
  const textInput = document.getElementById("reviewTextInput");
  const ratingInput = document.getElementById("reviewRatingInput");
  const reviewsRow = document.querySelector("#reviews .row.g-4");
  if (!addBtn || !textInput || !ratingInput || !reviewsRow) return;
  addBtn.addEventListener("click", async function () {
    const text = textInput.value.trim();
    if (!text) {
      showToast("Введите текст отзыва");
      return;
    }
    const user = getCurrentUser();
    const author = user && user.name ? user.name : "Гость";
    const authorId = user ? Number(user.id) : null;
    const rating = Number(ratingInput.value || "5");
    try {
      const review = await apiRequest("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          routeId: Number(routeId),
          author: author,
          authorId: authorId,
          rating: rating,
          text: text
        })
      });
      reviewsRow.insertAdjacentHTML("afterbegin", buildReviewCardHtml(review, user));
      textInput.value = "";
      ratingInput.value = "5";
      showToast("Отзыв добавлен");
    } catch (error) {
      showToast("Не удалось добавить отзыв");
    }
  });
}

function setupReviewDelete() {
  const reviewsRow = document.querySelector("#reviews .row.g-4");
  if (!reviewsRow || reviewsRow.dataset.deleteReady === "true") return;
  reviewsRow.dataset.deleteReady = "true";
  reviewsRow.addEventListener("click", async function (e) {
    const btn = e.target.closest("[data-delete-review-id]");
    if (!btn) return;
    const reviewId = btn.getAttribute("data-delete-review-id");
    if (!reviewId) return;
    const user = getCurrentUser();
    if (!user) {
      showToast("Только авторизованный пользователь может удалить свой отзыв");
      return;
    }
    try {
      const review = await apiRequest("/reviews/" + reviewId);
      if (!review || Number(review.authorId) !== Number(user.id)) {
        showToast("Можно удалить только свой отзыв");
        return;
      }
      await apiRequest("/reviews/" + reviewId, {
        method: "DELETE"
      });
      const card = btn.closest("[data-review-id]");
      if (card) card.remove();
      showToast("Отзыв удалён");
    } catch (error) {
      showToast("Не удалось удалить отзыв");
    }
  });
}
