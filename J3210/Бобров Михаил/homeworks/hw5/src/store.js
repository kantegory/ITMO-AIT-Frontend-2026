import { reactive } from "vue";
import { request } from "./api.js";
import { session } from "./session.js";

export const store = reactive({
    myModels: [],
    myDatasets: [],
    mySubscriptions: [],
    globalModels: [],
    globalDatasets: [],
    comments: [],
    loaded: false
});

export async function loadStore() {
    const [myModels, myDatasets, mySubscriptions, globalModels, globalDatasets, comments] = await Promise.all([
        request("/myModels"),
        request("/myDatasets"),
        request("/mySubscriptions"),
        request("/globalModels"),
        request("/globalDatasets"),
        request("/comments")
    ]);
    Object.assign(store, { myModels, myDatasets, mySubscriptions, globalModels, globalDatasets, comments, loaded: true });
}

export async function removeItem(type, id) {
    const collections = {
        models: { list: store.myModels, path: "myModels" },
        datasets: { list: store.myDatasets, path: "myDatasets" },
        subs: { list: store.mySubscriptions, path: "mySubscriptions" }
    };
    const collection = collections[type];
    if (!collection || !window.confirm("Вы уверены?")) return false;
    await request(`/${collection.path}/${id}`, { method: "DELETE" });
    const index = collection.list.findIndex(item => item.id === id);
    if (index >= 0) collection.list.splice(index, 1);
    return true;
}

export async function addToCollection(type, id) {
    const model = type === "models";
    const source = model ? store.globalModels : store.globalDatasets;
    const target = model ? store.myModels : store.myDatasets;
    const endpoint = model ? "myModels" : "myDatasets";
    const item = source.find(entry => entry.id === id);
    if (!item || target.some(entry => entry.id === id)) {
        window.alert("Уже добавлено");
        return;
    }
    const created = await request(`/${endpoint}`, {
        method: "POST",
        body: { ...item, date: new Date().toLocaleDateString("ru-RU") }
    });
    target.push(created);
    window.alert("Добавлено в вашу коллекцию!");
}

export async function uploadItem(name, type, tag = "Custom") {
    const dataset = type === "dataset";
    const path = dataset ? "myDatasets" : "myModels";
    const item = dataset ? {
        name,
        format: "JSON",
        size: "0MB",
        tag,
        date: new Date().toLocaleDateString("ru-RU"),
        rows: "0",
        description: "Пользовательский датасет",
        likes: 0,
        license: "Private"
    } : {
        name,
        framework: "Custom",
        size: "0MB",
        tag,
        date: new Date().toLocaleDateString("ru-RU"),
        author: session.name || "Пользователь",
        description: "Пользовательская модель",
        version: "1.0.0",
        likes: 0,
        forks: 0,
        license: "Private"
    };
    const created = await request(`/${path}`, { method: "POST", body: item });
    (dataset ? store.myDatasets : store.myModels).push(created);
}

export function findModel(id) {
    return [...store.myModels, ...store.globalModels].find(item => item.id === Number(id));
}

export function findDataset(id) {
    return [...store.myDatasets, ...store.globalDatasets].find(item => item.id === Number(id));
}

export async function reactToItem(item, type, source) {
    const field = type === "like" ? "likes" : "forks";
    item[field] = (item[field] || 0) + 1;
    await request(`/${source}/${item.id}`, { method: "PATCH", body: { [field]: item[field] } });
}

export async function addComment(resourceId, page, text) {
    const comment = await request("/comments", {
        method: "POST",
        body: {
            user: session.name || "Пользователь",
            text,
            page,
            resourceId: Number(resourceId),
            createdAt: new Date().toISOString()
        }
    });
    store.comments.unshift(comment);
}
