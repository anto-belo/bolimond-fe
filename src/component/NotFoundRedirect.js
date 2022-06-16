import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const NotFoundRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => navigate('../admin/properties', {replace: true}), 3000);
    }, []);

    return (
        <div>
            <h1 className='text-center mt-5'>404 Not Found</h1>
            <h4 className='text-center mt-2'>Redirect in 3 sec...</h4>
        </div>
    );
};

export default NotFoundRedirect;