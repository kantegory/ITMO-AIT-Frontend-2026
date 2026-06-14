(function initHomeDataModule() {
  const root = window;
  root.EventPassHome = root.EventPassHome || {};

  const data = {};

  data.KUDAGO_LOCATION_LABELS = {
    msk: "Москва",
    spb: "Санкт-Петербург",
    nsk: "Новосибирск",
    ekb: "Екатеринбург",
    kzn: "Казань",
    nnv: "Нижний Новгород",
  };

  data.KUDAGO_SEARCH_LIMIT = 30;

  data.KUDAGO_LOCATION_ALIASES = {
    москва: "msk",
    мск: "msk",
    moscow: "msk",
    питер: "spb",
    "санкт петербург": "spb",
    "санкт-петербург": "spb",
    spb: "spb",
    piter: "spb",
    новосибирск: "nsk",
    nsk: "nsk",
    екатеринбург: "ekb",
    ekb: "ekb",
    казань: "kzn",
    kazan: "kzn",
    kzn: "kzn",
    "нижний новгород": "nnv",
    nnv: "nnv",
  };

  data.stripHtmlToText = function stripHtmlToText(value) {
    return String(value || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  data.formatKudaGoDate = function formatKudaGoDate(dates) {
    if (!Array.isArray(dates) || !dates.length) {
      return {
        dateLabel: "Скоро",
        dateIso: "",
      };
    }

    const nowTimestamp = Math.floor(Date.now() / 1000);
    const closestDate = dates.find((item) => Number(item.start) >= nowTimestamp) || dates[0];
    const startTimestamp = Number(closestDate.start);

    if (!Number.isFinite(startTimestamp) || startTimestamp <= 0) {
      return {
        dateLabel: "Скоро",
        dateIso: "",
      };
    }

    const date = new Date(startTimestamp * 1000);
    const dateIso = date.toISOString().slice(0, 10);
    const dateLabel = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return {
      dateLabel,
      dateIso,
    };
  };

  data.normalizeKudaGoImage = function normalizeKudaGoImage(images) {
    if (!Array.isArray(images) || !images.length) {
      return "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80";
    }

    const firstImage = images.find((item) => item && typeof item.image === "string" && item.image.trim()) || images[0];
    const imageUrl = firstImage && typeof firstImage.image === "string" ? firstImage.image.trim() : "";

    return imageUrl || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80";
  };

  data.normalizeKudaGoPrice = function normalizeKudaGoPrice(eventItem) {
    if (eventItem && eventItem.is_free) {
      return {
        value: 0,
        isKnown: true,
        isFree: true,
      };
    }

    const rawPrice = String(eventItem && eventItem.price ? eventItem.price : "").trim();
    const matches = rawPrice.match(/\d[\d\s\u00A0]*/g) || [];
    const values = matches
      .map((part) => Number(String(part).replace(/[^\d]/g, "")))
      .filter((value) => Number.isFinite(value) && value > 0);

    if (values.length) {
      return {
        value: Math.min(...values),
        isKnown: true,
        isFree: false,
      };
    }

    return {
      value: 0,
      isKnown: false,
      isFree: false,
    };
  };

  data.buildKudaGoEventUrl = function buildKudaGoEventUrl(eventItem) {
    const siteUrl = String(eventItem && eventItem.site_url ? eventItem.site_url : "").trim();
    if (!siteUrl) {
      return "#";
    }

    if (siteUrl.startsWith("http://") || siteUrl.startsWith("https://")) {
      return siteUrl;
    }

    return `https://kudago.com${siteUrl.startsWith("/") ? "" : "/"}${siteUrl}`;
  };

  data.normalizeCityToken = function normalizeCityToken(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/ё/g, "е")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ");
  };

  data.resolveKudaGoLocationCode = function resolveKudaGoLocationCode(value) {
    const normalized = data.normalizeCityToken(value);
    if (!normalized) {
      return "";
    }

    const aliasCode = data.KUDAGO_LOCATION_ALIASES[normalized];
    if (aliasCode) {
      return aliasCode;
    }

    const matchedEntry = Object.entries(data.KUDAGO_LOCATION_LABELS).find(
      ([, cityLabel]) => data.normalizeCityToken(cityLabel) === normalized
    );

    return matchedEntry ? matchedEntry[0] : "";
  };

  data.fetchKudaGoSearchIds = async function fetchKudaGoSearchIds(locationCode, searchQuery, pageSize) {
    const searchParams = new URLSearchParams({
      lang: "ru",
      location: String(locationCode || "msk"),
      page_size: String(pageSize || 15),
      ctype: "event",
      q: String(searchQuery || "").trim(),
    });

    const searchResponse = await fetch(`${API_BASE_URL}/kudago/search?${searchParams.toString()}`);
    if (!searchResponse.ok) {
      throw new Error(`KudaGo search API вернул статус ${searchResponse.status} для города ${locationCode}`);
    }

    const searchPayload = await searchResponse.json();
    const ids = Array.isArray(searchPayload.results)
      ? searchPayload.results
          .map((item) => Number(item && item.id))
          .filter((id) => Number.isFinite(id) && id > 0)
      : [];

    return ids;
  };

  data.fetchKudaGoEventsByLocation = async function fetchKudaGoEventsByLocation(locationCode, opts) {
    const options = opts || {};
    const actualSince = Math.floor(Date.now() / 1000);
    const hasIds = Array.isArray(options.ids) && options.ids.length > 0;

    const params = new URLSearchParams({
      lang: "ru",
      location: String(locationCode || "msk"),
      page_size: String(hasIds ? Math.min(options.ids.length, Number(options.pageSize || 15)) : Number(options.pageSize || 15)),
      is_free: "false",
      actual_since: String(actualSince),
      order_by: "-publication_date",
    });

    if (hasIds) {
      params.set("ids", options.ids.join(","));
    }

    const response = await fetch(`${API_BASE_URL}/kudago/events?${params.toString()}`);
    if (!response.ok) {
      const sourceName = hasIds ? "KudaGo events API" : "KudaGo API";
      throw new Error(`${sourceName} вернул статус ${response.status} для города ${locationCode}`);
    }

    const payload = await response.json();
    return Array.isArray(payload.results) ? payload.results : [];
  };

  data.mergeAndDedupeEvents = function mergeAndDedupeEvents(locationPayloads) {
    const deduped = new Map();

    locationPayloads.forEach(({ locationCode, results }) => {
      results.forEach((item) => {
        if (item && item.id && !deduped.has(String(item.id))) {
          deduped.set(String(item.id), {
            ...item,
            __locationCode: locationCode,
          });
        }
      });
    });

    return Array.from(deduped.values()).filter((item) => !item.is_free);
  };

  data.fetchKudaGoByLocations = async function fetchKudaGoByLocations({ locations, searchQuery, pageSize }) {
    const safeLocations = Array.isArray(locations) && locations.length ? locations : ["msk"];
    const normalizedQuery = String(searchQuery || "").trim();

    const locationResponses = await Promise.allSettled(
      safeLocations.map(async (locationCode) => {
        if (normalizedQuery) {
          const ids = await data.fetchKudaGoSearchIds(locationCode, normalizedQuery, pageSize);
          if (!ids.length) {
            return {
              locationCode,
              results: [],
            };
          }

          const results = await data.fetchKudaGoEventsByLocation(locationCode, {
            pageSize,
            ids,
          });

          return {
            locationCode,
            results,
          };
        }

        const results = await data.fetchKudaGoEventsByLocation(locationCode, {
          pageSize,
        });

        return {
          locationCode,
          results,
        };
      })
    );

    const locationPayloads = locationResponses
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    if (!locationPayloads.length) {
      throw new Error("Не удалось получить мероприятия ни для одного города.");
    }

    return data.mergeAndDedupeEvents(locationPayloads);
  };

  data.toKudaGoEventViewModel = function toKudaGoEventViewModel(item) {
    const dateData = data.formatKudaGoDate(item.dates);
    const category = Array.isArray(item.categories) && item.categories.length ? item.categories[0] : "Мероприятие";
    const rawLocationCode =
      (item && item.place && item.place.location ? String(item.place.location).trim().toLowerCase() : "") ||
      String(item.__locationCode || "")
        .trim()
        .toLowerCase();

    const city = data.KUDAGO_LOCATION_LABELS[rawLocationCode] || "Не указан";
    const venue = item && item.place && item.place.title ? item.place.title : "Площадка уточняется";
    const title = String(item && item.title ? item.title : "Событие").trim();
    const description = data.stripHtmlToText(item && item.description ? item.description : "");
    const shortDescription = description ? description.slice(0, 150) : "Описание скоро появится.";
    const price = data.normalizeKudaGoPrice(item);

    return {
      id: String(item && item.id ? item.id : generateId("kudago")),
      title: title || "Событие",
      category: category || "Мероприятие",
      city,
      venue,
      dateLabel: dateData.dateLabel,
      dateIso: dateData.dateIso,
      description: shortDescription + (description.length > 150 ? "..." : ""),
      image: data.normalizeKudaGoImage(item && item.images),
      price,
      url: data.buildKudaGoEventUrl(item),
      isExternalUrl: true,
      source: "api",
    };
  };

  root.EventPassHome.data = data;
})();
