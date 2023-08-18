import { NavLink, Link } from 'react-router-dom';

import './appHeader.scss';
import logo from '../../resources/img/logo.png';

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to='/'>
                <img
                    className="app__logo"
                    src={logo}
                    alt="marvel studios logo"
                    width={200}
                    height={45}
                    />
                </Link>
                <div><span>Marvel</span> information portal</div>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><NavLink 
                            end 
                            style={({isActive}) => ({color: isActive ? '#9F0013' : 'inherit'})} 
                            to="/">Characters</NavLink></li>
                    /
                    <li><NavLink 
                             
                            style={({isActive}) => ({color: isActive ? '#9F0013' : 'inherit'})} 
                            to="/comics">Comics</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;