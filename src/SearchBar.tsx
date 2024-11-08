import { useState, useContext, useCallback, memo, ChangeEvent, KeyboardEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import { AppActionType, OnSearchHandler } from './types';
import { AppContext } from './context';

const { Control } = Form;
const { Item } = Dropdown; 

type LocaleItemProps = {
    locale: string,
};

const LocaleItem = memo(function LocaleItem({ locale }: LocaleItemProps) {
    const dispatch = useContext(AppContext);
    const setLocale = useCallback(
        () => dispatch({ type: AppActionType.SET_LOCALE, locale }), 
        [dispatch, locale]
    );

    return (
        <Item onClick={setLocale}>{locale.toUpperCase()}</Item>
    );
});

type SearchBarProps = {
    locales: string[],
    locale: string,
    onSearch: OnSearchHandler,
};

function SearchBar({ locales, locale, onSearch }: SearchBarProps) {
    const [search, setSearch] = useState('');

    const onSearchChange = ({ target }: ChangeEvent<HTMLInputElement>) => setSearch(target.value);
    const submit = () => void onSearch(search);
    const onKeyUp = ({ key }: KeyboardEvent<HTMLInputElement>) => (key === 'Enter') && submit();

    return (
        <div className='search-bar'>
            <Control placeholder='Искать текст' name='search' value={search} onChange={onSearchChange} onKeyUp={onKeyUp} />
            <Button onClick={submit}>Найти</Button>
            <DropdownButton variant='secondary' title={locale.toUpperCase()}>
                {locales.map(loc => (<LocaleItem key={loc} locale={loc} />))}
            </DropdownButton>
        </div>
    );
};

export default SearchBar;
