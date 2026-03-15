(() => {
    const learningIds = [1, 2, 4];
    const createdIds = [1, 4, 10];
    const getCourses = () => window.coursesData;
    const getCourse = (id) => window.coursesData.find((course) => course.id === Number(id));
    const getLearningCourses = () => window.coursesData.filter((course) => learningIds.includes(course.id));
    const getCreatedCourses = () => window.coursesData.filter((course) => createdIds.includes(course.id));
    window.store = {getCourses, getCourse, getLearningCourses, getCreatedCourses
    };
})();
