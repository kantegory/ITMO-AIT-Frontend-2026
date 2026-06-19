(function () {
    const ROLE_HOME_MAP = {
        student: "profile.html",
        teacher: "teacher.html",
        admin: "admin.html"
    };

    const PROPOSAL_FORM_URL = "#";

    function normalizeRole(role) {
        const normalizedRole = String(role || "").trim().toLowerCase();
        return ROLE_HOME_MAP[normalizedRole] ? normalizedRole : "student";
    }

    function normalizeUser(user) {
        if (!user || typeof user !== "object") {
            return null;
        }

        return {
            ...user,
            id: String(user.id || ""),
            email: String(user.email || "").trim().toLowerCase(),
            firstName: String(user.firstName || "").trim(),
            lastName: String(user.lastName || "").trim(),
            role: normalizeRole(user.role),
            isExternal: Boolean(user.isExternal),
            studentClass: user.studentClass ?? null,
            studentLetter: user.studentLetter ?? null
        };
    }

    function normalizeGoal(goal) {
        const value = String(goal || "").trim().toLowerCase();

        return {
            sport: "sport",
            sports: "sport",
            "спортивные": "sport",
            "спортивное": "sport",
            "спорт": "sport",
            fun: "fun",
            entertainment: "fun",
            "развлекательные": "fun",
            "развлекательное": "fun",
            "развлечение": "fun",
            study: "study",
            education: "study",
            "учебные": "study",
            "учебное": "study",
            "учеба": "study",
            ceremony: "ceremony",
            "торжественные": "ceremony",
            "торжественное": "ceremony",
            "торжество": "ceremony"
        }[value] || "fun";
    }

    function normalizePlace(place) {
        const value = String(place || "").trim().toLowerCase();

        return {
            assembly: "assembly",
            "актовый зал": "assembly",
            yard: "yard",
            "школьный двор": "yard",
            двор: "yard",
            classroom: "classroom",
            "школьный класс": "classroom",
            класс: "classroom",
            outside: "outside",
            "вне школы": "outside",
            stadium: "stadium",
            стадион: "stadium",
            gym1: "gym1",
            "спортивный зал №1": "gym1",
            "спортзал №1": "gym1",
            gym2: "gym2",
            "спортивный зал №2": "gym2",
            "спортзал №2": "gym2"
        }[value] || "assembly";
    }

    function normalizeDate(rawDate) {
        if (!rawDate) {
            return "";
        }

        const date = new Date(rawDate);
        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function normalizeEvent(event) {
        if (!event || typeof event !== "object") {
            return null;
        }

        return {
            ...event,
            id: String(event.id || ""),
            title: String(event.title || "").trim() || "Без названия",
            description: String(event.description || "").trim() || "Описание мероприятия пока не добавлено.",
            image: String(event.image || "").trim() || "img/carousel1.png",
            date: normalizeDate(event.date),
            goal: normalizeGoal(event.goal || event.category || event.purpose),
            place: normalizePlace(event.place),
            capacity: Number(event.capacity || event.maxParticipants || event.limit || 30) || 30,
            audience: String(event.audience || event.forWhom || "5–11 классы").trim(),
            responsibleTeacherId: String(event.responsibleTeacherId || "")
        };
    }

    function getCurrentUser() {
        try {
            return normalizeUser(JSON.parse(localStorage.getItem("currentUser")));
        } catch {
            return null;
        }
    }

    function setCurrentUser(user) {
        if (!user) {
            localStorage.removeItem("currentUser");
            return null;
        }

        const normalizedUser = normalizeUser(user);
        const sessionUser = {
            id: normalizedUser.id,
            email: normalizedUser.email,
            firstName: normalizedUser.firstName,
            lastName: normalizedUser.lastName,
            role: normalizedUser.role,
            isExternal: normalizedUser.isExternal,
            studentClass: normalizedUser.studentClass,
            studentLetter: normalizedUser.studentLetter
        };

        localStorage.setItem("currentUser", JSON.stringify(sessionUser));
        return sessionUser;
    }

    function logout() {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("accessToken");
    }

    function getGoalLabel(goal) {
        return {
            sport: "Спортивные",
            fun: "Развлекательные",
            study: "Учебные",
            ceremony: "Торжественные"
        }[goal] || "Развлекательные";
    }

    function getPlaceLabel(place) {
        return {
            assembly: "Актовый зал",
            yard: "Школьный двор",
            classroom: "Школьный класс",
            outside: "Вне школы",
            stadium: "Стадион",
            gym1: "Спортивный зал №1",
            gym2: "Спортивный зал №2"
        }[place] || "Актовый зал";
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "Дата уточняется";
        }

        const [year, month, day] = String(dateString).split("-");
        if (!year || !month || !day) {
            return "Дата уточняется";
        }

        return `${day}.${month}.${year}`;
    }

    function getHomePageForUser(user) {
        return ROLE_HOME_MAP[normalizeRole(user?.role)];
    }

    function redirectToUserHome(user) {
        const destination = getHomePageForUser(user);
        if (destination) {
            window.location.href = destination;
        }
    }

    window.SchoolAuth = {
        PROPOSAL_FORM_URL,
        formatDate,
        getCurrentUser,
        getGoalLabel,
        getHomePageForUser,
        getPlaceLabel,
        logout,
        normalizeEvent,
        normalizeUser,
        redirectToUserHome,
        setCurrentUser
    };
})();
