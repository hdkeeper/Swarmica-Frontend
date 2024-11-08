import { useContext, useCallback, memo } from 'react';
import Spinner from 'react-bootstrap/Spinner';

import { AppActionType, ArticleStatus, Article } from './types';
import { AppContext } from './context';

type ArticleItemProps = Article & { isVisited: boolean };

const ArticleItem = memo(function ArticleItem({ id, title, url, isVisited }: ArticleItemProps) {
    const dispatch = useContext(AppContext);
    const addVisited = useCallback(
        () => isVisited || dispatch({ type: AppActionType.ADD_VISITED, id }),
        [dispatch, id, isVisited]
    );

    const aClass = `ref${isVisited ? ' visited' : ''}`;
    return (
        <div className={aClass}>
            <a href={url} target='_blank' rel='noreferrer' onClick={addVisited}>{title}</a>
        </div>
    );
});

export type ArticlesProps = {
    status: ArticleStatus,
    articles: Article[],
    visited: Set<number>,
};

function Articles({ status, articles, visited }: ArticlesProps) {
    if (status == ArticleStatus.EMPTY) {
        return (<div className='articles' />);
    }
    
    if (status == ArticleStatus.LOADING) {
        return (
            <div className='articles'>
                <Spinner variant='primary' />
            </div>
        );
    }

    return (
        <div className='articles'>
            {articles.length === 0 ? 
                (<div>Ничего не найдено</div>) :
                articles.map(item => (
                    <ArticleItem key={item.id} {...item} isVisited={visited.has(item.id)} />
                ))
            }
        </div>
    );
};

export default Articles;
