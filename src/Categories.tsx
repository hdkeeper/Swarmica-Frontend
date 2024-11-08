import { useContext, useCallback, memo } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

import { Category, AppActionType } from './types';
import { AppContext } from './context';

const { Item } = ListGroup;
const { Check } = Form;


type CategoryItemProps = {
    id: number,
    name: string,
    selected: boolean,
};

const CategoryItem = memo(function CategoryItem({ id, name, selected }: CategoryItemProps) {
    const dispatch = useContext(AppContext);
    const toggleSelected = useCallback(
        () => dispatch({ type: AppActionType.TOGGLE_CATEGORY, id }),
        [dispatch, id]
    );

    return (
        <Item>
            <Check type='checkbox' label={name} id={id.toString()} checked={selected} onChange={toggleSelected} />
        </Item>
    );
})

type CategoriesProps = {
    categories: Category[],
    locale: string,
};

function Categories({ categories, locale }: CategoriesProps) {
    return (
        <ListGroup className='left'>
            <Item className='header'>Разделы</Item>
            {categories.map(item => (
                <CategoryItem key={item.id} id={item.id} name={item.name[locale]} selected={item.selected} />
            ))}
        </ListGroup>
    );
};

export default Categories;
