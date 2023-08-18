import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';


import useMarvelService from '../../services/MarvelService';

import './liveSearchCharacter.scss';

const LiveSearchCharacter = () => {
    const [data, setData] = useState([]);
    const [input, setInput] = useState("");
    const [display, setDisplay] = useState(true);

    const {loading, error, getCharacterByNameInput} = useMarvelService();


    useEffect(() => {
        if(input === '') {
            setData([]);
        }
        onCharLoaded(input)
        // eslint-disable-next-line
    }, [input])

    const onCharLoaded = (name) => {
        if(!name) {
            return
        }
        getCharacterByNameInput(name)
            .then(onDataLoaded)
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    const renderCharacter = (data) => data.map(({id, name, thumbnail}) =>
            <Link to={`/characters/${id}`} key={name}>
                <div className="findCharacter__results-wrapper">
                    <img src={thumbnail} alt={name} />
                    <div className="findCharacter__desc">{name}</div>
                </div>
            </Link>);

    const noDisplay = display || !input ? 'none' : 'grid';

    display ? document.body.style.overflow = 'auto' : document.body.style.overflow = 'hidden';

    return (
        <section className='findCharacter'>
            <div className="container">
                <div className="findCharacter__block">
                    <form>
                        <input  value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onBlur={() => setTimeout(() => setDisplay(true), 150)}
                                onFocus={() => setDisplay(false)}
                                name='find'
                                autoComplete='off'
                                placeholder='Or find a character by name'
                                type="text" />
                        {data.length === 0 ? null :
                            <div className="findCharacter__results" style={{animation: `fadeIn .4s`, display: noDisplay}}>
                                {loading ? 'loading...' : renderCharacter(data)}
                            </div>}
                    </form>
                </div>
                {error ? <div style={{fontWeight: 'bold', color: 'red'}}>Unknow error, try search again</div> : null}
            </div>
            {display ? null : <div style={{width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.413)', position: 'fixed', top: '0', left: '0', right: '0', zIndex: '9'}}></div>}
        </section>
    )
}

export default LiveSearchCharacter