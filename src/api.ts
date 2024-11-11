import axios from 'axios';

import {
    APICategory, GetLocalesResult, Article, 
    APIInstanceResponse, APICategoriesResponse, APIArticlesResponse
} from './types';

const api = axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
    },
});

export const getLocales = async (): Promise<GetLocalesResult> => {
    const res = await api.get('/instance/');
    const data = res.data as APIInstanceResponse;
    return {
        locales: data.locales,
        default: data.default_locale,
    };
};

export const getCategories = async (): Promise<APICategory[]> => {
    const res = await api.get('/categories/?ordering=id');
    const data = res.data as APICategoriesResponse;
    return data.results.map(o => ({
        id: o.id,
        name: o.name,
    }));
};

export const getArticles = async (search: string, locale: string, categories?: number[]): Promise<Article[]> => {
    let url = '/articles/?search=' + encodeURIComponent(search) + '&locale=' + encodeURIComponent(locale);
    if (categories) {
        url += '&category=' + encodeURIComponent(categories.join(','));
    }

    const res = await api.get(url);
    const data = res.data as APIArticlesResponse;
    return data.results
        .filter(o => Boolean(o.title[locale] && o.public_urls[locale]))
        .map(o => ({
            id: o.id,
            title: o.title[locale],
            url: o.public_urls[locale],
        }));
};

// localStorage

export const getVisited = (): Set<number> => {
    return new Set(JSON.parse(localStorage.getItem('visited') || '[]') as number[]);
};

export const saveVisited = (visited: Set<number>) => {
    localStorage.setItem('visited', JSON.stringify([...visited]));
};
