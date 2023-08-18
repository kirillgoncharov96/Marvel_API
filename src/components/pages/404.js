import ErrorMessage from "../errorMessage/ErrorMessage";
import {Link} from "react-router-dom";

const Page404 = () => {
    return (
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '25px'}}>Page doesn't exist</p>
            <Link style={{'textAlign': 'center', 'display': 'block', 'textAling': 'center', 'fontWeight': 'bold', 'fontSize': '25px',
            'marginTop': '30px'}} to='/'>
                Back to main page
            </Link>
        </div>
    )

}

export default Page404;