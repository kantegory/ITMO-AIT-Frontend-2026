import { reactive } from "vue";
import { request } from "../api.js";
import { useSession } from "./useSession.js";

const { session } = useSession();
const resources = reactive({
    myModels: [],
    myDatasets: [],
    mySubscriptions: [],
    globalModels: [],
    globalDatasets: [],
    comments: [],
    loaded: false
});

async function loadResources() {
    const [myModels, myDatasets, mySubscriptions, globalModels, globalDatasets, comments] = await Promise.all([
        request("/myModels"),
        request("/myDatasets"),
        request("/mySubscriptions"),
        request("/globalModels"),
        request("/globalDatasets"),
        request("/comments")
    ]);
    Object.assign(resources, { myModels, myDatasets, mySubscriptions, globalModels, globalDatasets, comments, loaded: true });
}

async function removeItem(type, id) {
    const collections = {
        models: { list: resources.myModels, path: "myModels" },
        datasets: { list: resources.myDatasets, path: "myDatasets" },
        subs: { list: resources.mySubscriptions, path: "mySubscriptions" }
    };
    const collection = collections[type];
    if (!collection || !window.confirm("Вы уверены?")) return false;
    await request(`/${collection.path}/${id}`, { method: "DELETE" });
    const index = collection.list.findIndex(item => item.id === id);
    if (index >= 0) collection.list.splice(index, 1);
    return true;
}

async function addToCollection(type, id) {
    const model = type === "models";
    const source = model ? resources.globalModels : resources.globalDatasets;
    const target = model ? resources.myModels : resources.myDatasets;
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

async function uploadItem(name, type, tag = "Custom") {
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
    (dataset ? resources.myDatasets : resources.myModels).push(created);
}

function findModel(id) {
    return [...resources.myModels, ...resources.globalModels].find(item => item.id === Number(id));
}

function findDataset(id) {
    return [...resources.myDatasets, ...resources.globalDatasets].find(item => item.id === Number(id));
}

async function reactToItem(item, type, source) {
    const field = type === "like" ? "likes" : "forks";
    item[field] = (item[field] || 0) + 1;
    await request(`/${source}/${item.id}`, { method: "PATCH", body: { [field]: item[field] } });
}

async function addComment(resourceId, page, text) {
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
    resources.comments.unshift(comment);
}

export function useResources() {
    return {
        resources,
        loadResources,
        removeItem,
        addToCollection,
        uploadItem,
        findModel,
        findDataset,
        reactToItem,
        addComment
    };
}
