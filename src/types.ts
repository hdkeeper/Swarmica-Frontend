import { Dispatch } from 'react';

export type Category = APICategory & {
    selected: boolean,
};

export type Article = {
    id: number,
    url: string,
    title: string,
};

// API responses

export type GetLocalesResult = {
    locales: string[],
    default: string,
};

export type APICategory = {
    id: number,
    name: {
        [locale: string]: string
    },
};

export type APIArticle = {
    id: number,
    title: {
        [locale: string]: string
    },
    public_urls: {
        [locale: string]: string
    },
};

export type APIInstanceResponse = {
    locales: string[],
    default_locale: string,
};

export type APICategoriesResponse = {
    results: APICategory[],
};

export type APIArticlesResponse = {
    results: APIArticle[],
}

// State management

export enum AppActionType {
    INIT = 'INIT',
    SET_LOCALE = 'SET_LOCALE',
    TOGGLE_CATEGORY = 'TOGGLE_CATEGORY',
    START_SEARCH = 'START_SEARCH',
    FINISH_SEARCH = 'FINISH_SEARCH',
    ADD_VISITED = 'ADD_VISITED',
};

export enum ArticleStatus {
    EMPTY = 'EMPTY',
    LOADING = 'LOADING',
    READY = 'READY',
};

type AppActionInit = {
    type: AppActionType.INIT,
    locales: string[],
    currentLocale: string,
    categories: Category[],
};

type AppActionSetLocale = {
    type: AppActionType.SET_LOCALE,
    locale: string,
};

type AppActionToggleCategory = {
    type: AppActionType.TOGGLE_CATEGORY,
    id: number,
};

type AppActionStartSearch = {
    type: AppActionType.START_SEARCH
};

type AppActionFinishSearch = {
    type: AppActionType.FINISH_SEARCH,
    articles: Article[],
};

type AppActionAddVisited = {
    type: AppActionType.ADD_VISITED,
    id: number,
};

export type AppAction = AppActionInit | AppActionSetLocale | AppActionToggleCategory | AppActionStartSearch | AppActionFinishSearch | AppActionAddVisited;

export type AppDispatch = Dispatch<AppAction>;

export type OnSearchHandler = (search: string) => Promise<void>;
