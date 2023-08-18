import './comicsList.scss';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Transition, TransitionGroup } from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import SpinnerMy from '../spinner/SpinnerMy';


const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(true);
    const [loadOnScroll, setLoadOnScroll] = useState(false);
    const [offset, setOffset] = useState(200);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [animStart, setAnimStart] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();


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
        getAllComics(offset)
            .then(onAllComicsLoaded)
    }

    const onAllComicsLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }
        setLoadOnScroll(false);
        setNewItemLoading(newItemLoading => false);
        setAnimStart(animStart => true);
        setComicsList((comicsList) => [...comicsList, ...newComicsList]);
        setOffset((offset) => offset + 8);
        setComicsEnded(comicsEnded => ended);
    }


    function renderComicsItems(arrItems) {
        let delay = 0;
        const items = arrItems.map((item, i) => {
            const duration = 400;
            if (i >= arrItems.length - 8) {
                delay += 100;
            }

            const defaultStyle = {
                transition: `all ${duration}ms ease-in-out`,
                opacity: 0,
                transform: 'translateY(-30%)',
                transitionDelay: `${delay}ms`
            };

            const transitionStyles = {
                entering: { opacity: 0, transform: 'translateY(-30%)', transitionDelay: `${delay}ms` },
                entered: { opacity: 1, transform: 'translateY(0)', transitionDelay: `${delay}ms` },
                exiting: { opacity: 1, transform: 'translateY(0)', transitionDelay: `${delay}ms` },
                exited: { opacity: 0, transform: 'translateY(30%)', transitionDelay: `${delay}ms` },
            }; 

            
            return (
                <Transition timeout={duration} key={i} in={animStart}>
                    {state => (
                        <li className="comics__item" key={i} tabIndex={0} 
                        style={{
                            ...defaultStyle,
                            ...transitionStyles[state]
                            }}>
                            <Link to={`/comics/${item.id}`}>
                                <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                                <div className="comics__item-name">{item.title}</div>
                                <div className="comics__item-price">{item.price}</div>
                            </Link>
                        </li>
                    )}
                </Transition>
            )
        });
        

        return (
            <ul className="comics__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const items = renderComicsItems(comicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && (comicsList.length < 8) ? <SpinnerMy/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest()}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;