export const storage = {
    getIsLoggedIn: () => localStorage.getItem("isLoggedIn") === "true",
    setIsLoggedIn: (value) => localStorage.setItem("isLoggedIn", value ? "true" : "false"),
    getUserId: () => localStorage.getItem("userId") || "",
    setUserId: (id) => localStorage.setItem("userId", id),
    getUserName: () => localStorage.getItem("userName") || "",
    setUserName: (name) => localStorage.setItem("userName", name),
    getUserEmail: () => localStorage.getItem("userEmail") || "",
    setUserEmail: (email) => localStorage.setItem("userEmail", email),
    getSubscriptions: () => {
        try {
            return JSON.parse(localStorage.getItem("subscriptions")) || [];
        } catch {
            return [];
        }
    },
    setSubscriptions: (list) => localStorage.setItem("subscriptions", JSON.stringify(list)),
    getStarred: () => {
        try {
            return JSON.parse(localStorage.getItem("starred")) || [];
        } catch {
            return [];
        }
    },
    setStarred: (list) => localStorage.setItem("starred", JSON.stringify(list))
};
