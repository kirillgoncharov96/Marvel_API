import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import SpinnerMy from "../spinner/SpinnerMy";
import AppBanner from "../appBanner/AppBanner";

const GeneralPage = ({Component, dataType}) => {
    const {id} = useParams();
    const [data, setData] = useState(null);
    const {loading, error, getCharacters, getComics, clearError} = useMarvelService();

    useEffect(() => {
        updateData()
        // eslint-disable-next-line
    }, [id])

    const updateData = () => {
        clearError();
        
        switch (dataType) {
            case 'comic':
                getComics(id).then(onDataLoaded);
                break;
            case 'character':
                getCharacters(id).then(onDataLoaded);
                break;
            default: 
                return;
        }
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <SpinnerMy/> : null;
    const content = !(loading || error || !data) ? <Component data={data}/> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )

}

export default GeneralPage;