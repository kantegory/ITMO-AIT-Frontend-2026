(() => {
    document.getElementById("learningCount").textContent = window.store.getLearningCourses().length;
    document.getElementById("createdCount").textContent = window.store.getCreatedCourses().length;
})();
