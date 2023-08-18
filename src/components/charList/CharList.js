import { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import SpinnerMy from '../spinner/SpinnerMy';
import './charList.scss';


const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(true);
    const [loadOnScroll, setLoadOnScroll] = useState(false);
    const [offset, setOffset] = useState(0);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
        window.addEventListener('scroll', onRequestScroll);
        return () => window.removeEventListener('scroll', onRequestScroll);
        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        if (loadOnScroll) {
            onRequest();
        }
        // eslint-disable-next-line
    }, [loadOnScroll])

    const onRequestScroll = () => {
        const scrollTop = window.scrollY;
        const screen = document.documentElement.clientHeight;
        const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - 5;
        if (scrollTop + screen >= height) {
            setLoadOnScroll(newItemLoading => true);
        }
    }

    const onRequest = (initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onAllCharLoaded)
    }

    const onAllCharLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        setLoadOnScroll(false);
        setNewItemLoading(newItemLoading => false);
        setCharList((charList) => [...charList, ...newCharList]);
        setOffset((offset) => offset + 9);
        setCharEnded(charEnded => ended);
    }


    function renderCharItems(arrItem) {
        let delay = 0;
        const items = arrItem.map((item, i) =>{
        let imgStyle = {'objectFit' : 'cover'};
        const active = item.id === props.selectedId;
        const clazz = active ? 'char__item char__item_selected' : 'char__item';
        if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'unset'};
        }
        
        if (i >= arrItem.length - 9) {
            delay += 150
        }

        return (
            <CSSTransition key={i} timeout={delay} classNames="char__item">
                <li
                    tabIndex={0}
                    key={i}
                    onClick={() => props.onCharSelected(item.id)}
                    onKeyDown={(e) => {
                        if(e.key === ' ' || e.key === 'Enter') {
                            props.onCharSelected(item.id);
                        }
                    }}
                    className={clazz}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            </CSSTransition>  
        )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>       
        )
    }

    const items = renderCharItems(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && (charList.length < 9) ? <SpinnerMy/> : null;
    
    return (
        
        <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}}
                onClick={() => onRequest()}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    
             
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;