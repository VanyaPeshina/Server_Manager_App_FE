import { DataState } from "../enum/data-state.enum";

//generic interface
export interface AppState<T> {
    dataState: DataState;
    // we cannot have the appData and an error at the same time
    // it is either the one or the other
    // so they should be optional -> (?)
    appData?: T;
    error?: string;
}