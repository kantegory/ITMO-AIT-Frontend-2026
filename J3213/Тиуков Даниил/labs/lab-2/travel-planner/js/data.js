(() => {
    // Label maps are kept client-side for display purposes
    const labelMaps = {
        type: { city: "Город", nature: "Природа", mixed: "Смешанный" },
        budget: { low: "Низкий", medium: "Средний", high: "Высокий" }
    };

    window.TravelAppData = {
        labelMaps
    };
})();
