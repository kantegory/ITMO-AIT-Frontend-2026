const isAuth = !!localStorage.accessToken;

document.querySelectorAll(".auth").forEach((el) => {
    if (isAuth) el.hidden = false;
});
document.querySelectorAll(".notauth").forEach((el) => {
    if (!isAuth) el.hidden = false;
});

const logout = document.getElementById("logout");
if (logout) {
    logout.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        location.href = "catalog.html";
    });
}
