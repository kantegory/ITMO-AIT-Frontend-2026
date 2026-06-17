async function initEventPage() {
  const title = document.getElementById("eventTitle");
  if (!title) {
    return;
  }

  const EVENT_CATALOG = {
    "symphonic-cinema-night": {
      id: "symphonic-cinema-night",
      category: "Концерт",
      name: "Symphonic Cinema Night",
      date: "21 апреля 2026",
      dateIso: "2026-04-21",
      time: "19:00",
      city: "Москва",
      venue: "Vegas City Hall",
      venueAddress: "Vegas City Hall, Москва, 66-й км МКАД, Крокус Сити",
      venueDetails: "Рядом метро «Мякинино», удобный вход с набережной и подземная парковка.",
      age: "12+",
      price: 2500,
      description: "Большой концерт-саундтрек: живой оркестр исполнит музыку из культовых фильмов на большом экране.",
      posterImage: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=1200&q=80",
      hallSchemeImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
      seatForPurchase: "Сектор B, ряд 3, место 7",
      reviews: [
        { author: "Анна П.", text: "Оркестр и визуал на экране были на высоте, атмосфера потрясающая." },
        { author: "Максим Л.", text: "Отличная организация и хороший звук, рекомендую брать места ближе к центру." },
        { author: "Екатерина С.", text: "Очень понравился подбор треков из фильмов, вечер прошел идеально." }
      ]
    },
    "neon-lights-live": {
      id: "neon-lights-live",
      category: "Концерт",
      name: "Neon Lights Live",
      date: "14 мая 2026",
      dateIso: "2026-05-14",
      time: "20:00",
      city: "Москва",
      venue: "ВТБ Арена",
      venueAddress: "ВТБ Арена, Москва, Ленинградский проспект, 36",
      venueDetails: "Вход с центрального фасада, доступны гардероб и фудкорт на втором уровне.",
      age: "16+",
      price: 1900,
      description: "Большое сольное шоу с визуальными эффектами и новой концертной программой.",
      posterImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
      hallSchemeImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=80",
      seatForPurchase: "Сектор A, ряд 4, место 12",
      reviews: [
        { author: "Илья Н.", text: "Свет и звук были очень мощными, шоу держало до последней песни." },
        { author: "Мария К.", text: "Понравилась сцена и организация входа, всё прошло без очередей." },
        { author: "Тимур Р.", text: "Отличная энергетика, обязательно пойду еще на следующий тур." }
      ]
    },
    "hamlet-new-stage": {
      id: "hamlet-new-stage",
      category: "Театр",
      name: "Гамлет: Новая сцена",
      date: "18 мая 2026",
      dateIso: "2026-05-18",
      time: "19:30",
      city: "Санкт-Петербург",
      venue: "Александринский театр",
      venueAddress: "Александринский театр, Санкт-Петербург, пл. Островского, 6",
      venueDetails: "Тихий зал с хорошей акустикой, рекомендуем приходить за 30 минут до начала.",
      age: "12+",
      price: 1200,
      description: "Современное прочтение классики с минималистичной сценографией и живой музыкой.",
      posterImage: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80",
      hallSchemeImage: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1000&q=80",
      seatForPurchase: "Партер, ряд 2, место 8",
      reviews: [
        { author: "Софья В.", text: "Необычная постановка, глубокая игра актеров и сильная режиссура." },
        { author: "Никита С.", text: "Впечатлила сценография и работа со светом, очень атмосферно." },
        { author: "Ольга М.", text: "Спектакль держит внимание от начала до конца, рекомендую." }
      ]
    },
    "city-league-final": {
      id: "city-league-final",
      category: "Спорт",
      name: "Финал Лиги Городов",
      date: "25 мая 2026",
      dateIso: "2026-05-25",
      time: "18:00",
      city: "Казань",
      venue: "Ак Барс Арена",
      venueAddress: "Ак Барс Арена, Казань, проспект Ямашева, 115А",
      venueDetails: "Для болельщиков открыты фан-зоны, рядом большая парковка и остановки транспорта.",
      age: "6+",
      price: 1500,
      description: "Решающий матч сезона с шоу-программой, гимном турнира и церемонией награждения.",
      posterImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",
      hallSchemeImage: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80",
      seatForPurchase: "Сектор C, ряд 6, место 18",
      reviews: [
        { author: "Денис Т.", text: "Крутая атмосфера, отличная видимость поля даже с верхних рядов." },
        { author: "Алёна З.", text: "Организация на уровне, быстро проходили контроль и рассадку." },
        { author: "Руслан А.", text: "Очень яркий финал, эмоции до мурашек, рекомендую всем фанатам спорта." }
      ]
    }
  };

  function toReadableDateFromIso(dateIso) {
    if (!dateIso || !/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
      return "";
    }

    const date = new Date(`${dateIso}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("ru-RU");
  }

  async function getOrganizerEventData(eventId) {
    if (!eventId.startsWith("organizer-")) {
      return null;
    }

    const organizerEventId = decodeURIComponent(eventId.slice("organizer-".length));
    const users = await getOrganizerUsersFromApi();

    for (const user of users) {
      if (user.accountType !== "organizer" || !Array.isArray(user.organizerEvents)) {
        continue;
      }

      const matchedEvent = user.organizerEvents.find((eventItem) => String(eventItem.id) === organizerEventId);
      if (!matchedEvent) {
        continue;
      }

      const readableDate = matchedEvent.date || toReadableDateFromIso(matchedEvent.dateIso) || "Скоро";
      const organizerPoster = (matchedEvent.posterImage || "").trim();
      const hasOrganizerPoster = organizerPoster.length > 0;
      return {
        id: `organizer-${organizerEventId}`,
        category: matchedEvent.category || "Мероприятие",
        name: matchedEvent.name || "Событие",
        date: readableDate,
        dateIso: matchedEvent.dateIso || "",
        time: matchedEvent.time || "19:00",
        city: matchedEvent.city || "Не указан",
        venue: matchedEvent.venue || "Площадка уточняется",
        venueAddress: `${matchedEvent.venue || "Площадка"}${matchedEvent.city ? `, ${matchedEvent.city}` : ""}`,
        venueDetails: "Событие добавлено организатором через личный кабинет.",
        age: matchedEvent.age || "6+",
        price: Number(matchedEvent.price || 0),
        description: matchedEvent.description || `Мероприятие от организатора ${user.name}. Подробное описание будет добавлено позже.`,
        posterImage: hasOrganizerPoster ? organizerPoster : "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
        hallSchemeImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80",
        seatForPurchase: "Электронный билет",
        reviews: [
          { author: "EventPass", text: "Это новое мероприятие. Отзывы появятся после первых посещений." }
        ],
      };
    }

    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("event") || "symphonic-cinema-night";
  const organizerEventData = await getOrganizerEventData(eventId);
  const eventData = organizerEventData || EVENT_CATALOG[eventId] || EVENT_CATALOG["symphonic-cinema-night"];

  const eventMeta = document.getElementById("eventMeta");
  const eventDescription = document.getElementById("eventDescription");
  const eventCityLine = document.getElementById("eventCityLine");
  const eventVenueLine = document.getElementById("eventVenueLine");
  const eventAgeLine = document.getElementById("eventAgeLine");
  const eventPriceLabel = document.getElementById("eventPriceLabel");
  const eventPoster = document.getElementById("eventPoster");
  const eventVenueAddress = document.getElementById("eventVenueAddress");
  const eventVenueDetails = document.getElementById("eventVenueDetails");
  const eventHallScheme = document.getElementById("eventHallScheme");
  const eventBuyButton = document.getElementById("eventBuyButton");
  const eventReviewsList = document.getElementById("eventReviewsList");
  const eventNavCurrentLink = document.getElementById("eventNavCurrentLink");

  document.title = `EventPass - ${eventData.name}`;
  title.textContent = eventData.name;
  eventMeta.textContent = `${eventData.category} • ${eventData.date} • ${eventData.time}`;
  eventDescription.textContent = eventData.description;
  eventCityLine.textContent = `Город: ${eventData.city}`;
  eventVenueLine.textContent = `Площадка: ${eventData.venue}`;
  eventAgeLine.textContent = `Возрастное ограничение: ${eventData.age}`;
  eventPriceLabel.textContent = `от ${eventData.price.toLocaleString("ru-RU")} ₽`;
  eventPoster.src = eventData.posterImage;
  eventPoster.alt = `Афиша мероприятия ${eventData.name}`;
  eventVenueAddress.textContent = eventData.venueAddress;
  eventVenueDetails.textContent = eventData.venueDetails;
  eventHallScheme.src = eventData.hallSchemeImage;
  eventHallScheme.alt = `Схема зала ${eventData.venue}`;

  if (eventNavCurrentLink) {
    eventNavCurrentLink.href = `event.html?event=${eventData.id}`;
  }

  if (eventBuyButton) {
    eventBuyButton.dataset.eventName = eventData.name;
    eventBuyButton.dataset.category = eventData.category;
    eventBuyButton.dataset.date = eventData.date;
    eventBuyButton.dataset.dateIso = eventData.dateIso;
    eventBuyButton.dataset.city = eventData.city;
    eventBuyButton.dataset.seat = eventData.seatForPurchase;
    eventBuyButton.dataset.price = String(eventData.price);

    const actions = window.EventPassHome && window.EventPassHome.actions;
    if (actions && typeof actions.initHomePurchaseActions === "function") {
      actions.initHomePurchaseActions();
    }
  }

  if (eventReviewsList) {
    eventReviewsList.innerHTML = eventData.reviews
      .map((review) => {
        return `
          <article class="border rounded p-3">
            <p class="mb-1 fw-semibold">${escapeHtml(review.author)}</p>
            <p class="small text-secondary mb-0">${escapeHtml(review.text)}</p>
          </article>
        `;
      })
      .join("");
  }
}

initEventPage();

