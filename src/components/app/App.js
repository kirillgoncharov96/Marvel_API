import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import SpinnerMy from "../spinner/SpinnerMy";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import AppHeader from "../appHeader/AppHeader";

import './app.scss';


const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleCharacterPage = lazy(() => import('../pages/singleCharacterPage/SingleCharacterPage'));
const SingleComicPage = lazy(() => import('../pages/singleComicPage/SingleComicPage'));
const GeneralPage = lazy(() => import('../pages/GeneralPage'));

const routes = [
    {path: '/', name: 'MainPage', element: <MainPage />},
    {path: '/comics', name: 'ComicsPage', element: <ComicsPage/>},
    {path: '/comics/:id', name: 'GeneralPage', element: <GeneralPage/>},
    {path: '/characters/:id', name: 'GeneralPage', element: <GeneralPage/>},
    {path: '*', name: 'Page404', element: <Page404/>},
]



const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<SpinnerMy/>}>
                        <TransitionGroup component={null}>
                            <Routes>
                                <Route path='/' element={<CSSTransition classNames='fade' timeout={500} key={routes[0].path} in={true}><MainPage/></CSSTransition>}/>
                                <Route path='/comics' element={<CSSTransition classNames='fade' timeout={500} key={routes[1].path} in={true}><ComicsPage/></CSSTransition>}/>
                                <Route path='/comics/:id' element={<CSSTransition classNames='fade' timeout={500} key={routes[2].path} in={true}><GeneralPage Component={SingleComicPage} dataType='comic'/></CSSTransition>}/>
                                <Route path='/characters/:id' element={<CSSTransition classNames='fade' timeout={500} key={routes[3].path} in={true}><GeneralPage Component={SingleCharacterPage} dataType='character'/></CSSTransition>}/>
                                <Route path='*' element={<CSSTransition classNames='fade' timeout={500} key={routes[4].path} in={true}><Page404/></CSSTransition>}/>
                            </Routes>
                        </TransitionGroup>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
    
}

export default App;