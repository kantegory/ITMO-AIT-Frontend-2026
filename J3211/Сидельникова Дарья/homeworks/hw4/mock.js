export const defaultUser = {
    id: 1,
    name: "Default user",
    email: "email@gmail.com",
    avatar: "https://i.pravatar.cc/150?img=12"
};

export const defaultProject = {
    id: 1,
    name: "Project 1",
    description: "This is the default project for demonstration.",
    role: "Administrator",
    team: [
        "Daria Side",
        "Man 1",
        "Woman 1"
    ],
    tasks: [
        {
            title: "Task 1",
            project: "Project 1",
            status: "To Do",
            due: "2026-03-20"
        },
        {
            title: "Task 2",
            project: "Project 1",
            status: "In Progress",
            due: "2026-03-22"
        },
        {
            title: "Task 3",
            project: "Project 1",
            status: "Done",
            due: "2026-03-18"
        }
    ]
};