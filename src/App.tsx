import { useEffect, useReducer } from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

import './App.less';
import Categories from './Categories';
import SearchBar from './SearchBar';
import Articles, { ArticlesProps } from './Articles';

import { Category, AppAction, AppActionType, ArticleStatus } from './types';
import {
    getLocales, getCategories, getArticles, getVisited, saveVisited
} from './api';
import { AppContext } from './context';


type AppState = {
    isLoading: boolean,
    locales: string[],
    currentLocale: string,
    categories: Category[],
    articles: ArticlesProps,
};

const initialState: AppState = {
    isLoading: true,
    locales: [],
    currentLocale: '',
    categories: [],
    articles: {
        status: ArticleStatus.EMPTY,
        articles: [],
        visited: getVisited(),
    },
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case AppActionType.INIT: {
            const { locales, currentLocale, categories } = action;
            return {
                ...state,
                isLoading: false,
                locales,
                currentLocale,
                categories,
            };
        }
        case AppActionType.SET_LOCALE: {
            return {
                ...state,
                currentLocale: action.locale,
            };
        }
        case AppActionType.TOGGLE_CATEGORY: {
            return {
                ...state,
                categories: state.categories.map(o => ({
                    ...o,
                    selected: o.id === action.id ? !o.selected : o.selected,
                }))
            };
        }
        case AppActionType.START_SEARCH: {
            return {
                ...state,
                articles: {
                    ...state.articles,
                    status: ArticleStatus.LOADING,
                }
            };
        }
        case AppActionType.FINISH_SEARCH: {
            return {
                ...state,
                articles: {
                    ...state.articles,
                    status: ArticleStatus.READY,
                    articles: action.articles,
                }
            };
        }
        case AppActionType.ADD_VISITED: {
            return {
                ...state,
                articles: {
                    ...state.articles,
                    visited: new Set(state.articles.visited).add(action.id),
                }
            };
        }
        default: {
            return state;
        }
    }
}

function App() {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { isLoading, locales, currentLocale, categories, articles } = state;

    useEffect(() => {
        void (async () => {
            const [locales, categories] = await Promise.all([
                getLocales(),
                getCategories(),
            ]);
            
            dispatch({
                type: AppActionType.INIT,
                locales: locales.locales,
                currentLocale: locales.default,
                categories: categories.map(o => ({ ...o, selected: true })),
            });
        })();
    }, []);

    const onSearch = async (search: string) => {
        if (!search) return;

        dispatch({ type: AppActionType.START_SEARCH });

        const articles = await getArticles(search, currentLocale,
            categories.filter(o => o.selected).map(o => o.id)
        );

        dispatch({
            type: AppActionType.FINISH_SEARCH,
            articles,
        });
    };

    useEffect(() => {
        saveVisited(articles.visited);
    }, [articles.visited]);

    return (
        <Container>
            {isLoading ? <Spinner variant='primary' /> : (
                <AppContext.Provider value={dispatch}>
                    <Categories categories={categories} locale={currentLocale} />
                    <SearchBar onSearch={onSearch} locales={locales} locale={currentLocale} />
                    <Articles {...articles} />
                </AppContext.Provider>
            )}
        </Container>
    );  
}

export default App;
