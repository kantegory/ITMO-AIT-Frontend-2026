import { request } from "./api.js";

export const state = {
    myModels: [],
    myDatasets: [],
    mySubscriptions: [],
    globalModels: [],
    globalDatasets: []
};

export async function loadState() {
    const [myModels, myDatasets, mySubscriptions, globalModels, globalDatasets] = await Promise.all([
        request("/myModels"),
        request("/myDatasets"),
        request("/mySubscriptions"),
        request("/globalModels"),
        request("/globalDatasets")
    ]);

    Object.assign(state, { myModels, myDatasets, mySubscriptions, globalModels, globalDatasets });
}
