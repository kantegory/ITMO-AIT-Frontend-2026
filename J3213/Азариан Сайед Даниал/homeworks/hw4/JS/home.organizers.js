(function initHomeOrganizersModule() {
  const root = window;
  root.EventPassHome = root.EventPassHome || {};

  const data = root.EventPassHome.data || {};
  const organizers = {};

  organizers.formatOrganizerDateLabel = function formatOrganizerDateLabel(dateIso, fallbackDate) {
    if (fallbackDate) {
      return fallbackDate;
    }

    const date = new Date(dateIso);
    if (Number.isNaN(date.getTime())) {
      return "Скоро";
    }

    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  organizers.toOrganizerEventViewModel = function toOrganizerEventViewModel(user, eventItem, index) {
    const eventId = String(eventItem && eventItem.id ? eventItem.id : `${user.id}_event_${index}`);
    const rawPrice = Number(eventItem && eventItem.price ? eventItem.price : 0);
    const priceValue = Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0;
    const description = String(eventItem && eventItem.description ? eventItem.description : "").trim();
    const shortDescription = description ? description.slice(0, 150) : "Событие от организатора EventPass.";

    return {
      id: eventId,
      title: String(eventItem && eventItem.name ? eventItem.name : "Новое событие").trim() || "Новое событие",
      category: String(eventItem && eventItem.category ? eventItem.category : "Мероприятие"),
      city: String(eventItem && eventItem.city ? eventItem.city : "Не указан"),
      venue: String(eventItem && eventItem.venue ? eventItem.venue : "Площадка уточняется"),
      dateLabel: organizers.formatOrganizerDateLabel(eventItem && eventItem.dateIso, eventItem && eventItem.date),
      dateIso: String(eventItem && eventItem.dateIso ? eventItem.dateIso : ""),
      description: shortDescription + (description.length > 150 ? "..." : ""),
      image: String(eventItem && eventItem.posterImage ? eventItem.posterImage : "").trim() || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      price: {
        value: priceValue,
        isKnown: true,
        isFree: priceValue === 0,
      },
      url: `event.html?event=organizer-${encodeURIComponent(eventId)}`,
      isExternalUrl: false,
      source: "organizer",
      organizerName: String(user && user.name ? user.name : "Организатор"),
    };
  };

  organizers.matchesOrganizerFilters = function matchesOrganizerFilters(eventItem, filterOptions) {
    if (!filterOptions) {
      return true;
    }

    const normalize = data.normalizeCityToken || ((value) => String(value || "").trim().toLowerCase());
    const normalizedQuery = normalize(filterOptions.searchText || "");
    const normalizedCity = normalize(filterOptions.selectedCity || "");
    const selectedDate = String(filterOptions.selectedDate || "").trim();

    if (selectedDate && String(eventItem.dateIso || "") !== selectedDate) {
      return false;
    }

    if (normalizedCity && normalize(eventItem.city) !== normalizedCity) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchIndex = [
      eventItem.title,
      eventItem.category,
      eventItem.city,
      eventItem.venue,
      eventItem.organizerName,
    ]
      .map((value) => normalize(value))
      .join(" ");

    return searchIndex.includes(normalizedQuery);
  };

  organizers.getOrganizerEventsForHome = async function getOrganizerEventsForHome(filterOptions) {
    const users = await getOrganizerUsersFromApi();

    return users
      .filter((user) => user.accountType === "organizer" && Array.isArray(user.organizerEvents))
      .flatMap((user) =>
        user.organizerEvents
          .map((eventItem, index) => organizers.toOrganizerEventViewModel(user, eventItem, index))
          .filter((eventItem) => organizers.matchesOrganizerFilters(eventItem, filterOptions))
      );
  };

  root.EventPassHome.organizers = organizers;
})();
