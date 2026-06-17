const API_URL = "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function buildPlacesQuery(filters = {}) {
  const params = new URLSearchParams();

  if (filters.type && filters.type !== "all") {
    params.set("type", filters.type);
  }

  if (filters.budget !== "" && filters.budget !== null && filters.budget !== undefined) {
    const budgetNumber = Number(filters.budget);

    if (!Number.isNaN(budgetNumber)) {
      params.set("budget_lte", String(budgetNumber));
    }
  }

  if (filters.days === "1-3") {
    params.set("days_gte", "1");
    params.set("days_lte", "3");
  } else if (filters.days === "4-7") {
    params.set("days_gte", "4");
    params.set("days_lte", "7");
  } else if (filters.days === "8+") {
    params.set("days_gte", "8");
  }

  params.set("_sort", "title");
  params.set("_order", "asc");

  const query = params.toString();
  return query ? `?${query}` : "";
}

async function getPlaces(filters = {}) {
  return apiRequest(`/places${buildPlacesQuery(filters)}`);
}

async function getPlaceByKey(key) {
  const items = await apiRequest(`/places?key=${encodeURIComponent(key)}`);
  return items[0] || null;
}

async function registerUser(userData) {
  return apiRequest("/users", {
    method: "POST",
    body: JSON.stringify(userData)
  });
}

async function findUserByEmail(email) {
  const items = await apiRequest(`/users?email=${encodeURIComponent(email)}`);
  return items[0] || null;
}

async function loginUser(email, password) {
  const items = await apiRequest(
    `/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  );
  return items[0] || null;
}

async function getSavedRoutes(userId) {
  return apiRequest(`/savedRoutes?userId=${userId}`);
}

async function saveRoute(routeData) {
  return apiRequest("/savedRoutes", {
    method: "POST",
    body: JSON.stringify(routeData)
  });
}

async function deleteSavedRoute(routeId) {
  return apiRequest(`/savedRoutes/${routeId}`, {
    method: "DELETE"
  });
}

async function clearSavedRoutesByUser(userId) {
  const routes = await getSavedRoutes(userId);

  for (const route of routes) {
    await deleteSavedRoute(route.id);
  }
}

async function getUserNote(userId) {
  const items = await apiRequest(`/notes?userId=${userId}`);
  return items[0] || null;
}

async function createUserNote(noteData) {
  return apiRequest("/notes", {
    method: "POST",
    body: JSON.stringify(noteData)
  });
}

async function updateUserNote(noteId, noteData) {
  return apiRequest(`/notes/${noteId}`, {
    method: "PATCH",
    body: JSON.stringify(noteData)
  });
}

async function getSharedItems() {
  return apiRequest("/sharedItems?_sort=id&_order=desc");
}

async function createSharedItem(itemData) {
  return apiRequest("/sharedItems", {
    method: "POST",
    body: JSON.stringify(itemData)
  });
}

async function deleteSharedItem(itemId) {
  return apiRequest(`/sharedItems/${itemId}`, {
    method: "DELETE"
  });
}

async function clearAllSharedItems() {
  const items = await getSharedItems();

  for (const item of items) {
    await deleteSharedItem(item.id);
  }
}