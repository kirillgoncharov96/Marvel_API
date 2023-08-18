import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import ErrorMessage from '../errorMessage/ErrorMessage';
import SpinnerMy from '../spinner/SpinnerMy';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';
import CharSearchForm from '../charSearchForm/CharSearchForm';
import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);
    
    const {loading, error, getCharacters, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId])
    

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }
        clearError();
        getCharacters(charId)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const skeleton =  char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <SpinnerMy/> : null;
    const content = !(loading || error || !char) ? <View View char={char}/> : null;

    return (
        <div className="char__info-wrapper">
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
            <CharSearchForm/>
        </div>
            
    )
    
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;
    const comicItems = comics.slice(0, 10).map((item,i) => {
        return (
            <li className="char__comics-item" key={i}>
                <Link to={`/comics/${item.resourceURI.split('/').pop()}`}>{item.name}</Link>
            </li> 
        )    
    });
    const clazz = (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? "contain" : "cover";

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={{objectFit: clazz}}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comicItems.length > 0 ? comicItems : "There is no comics with this character"}
            </ul> 
        </>
    )

}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;