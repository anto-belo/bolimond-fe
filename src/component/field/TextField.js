import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";

const TextField = ({name, value, maxLength, type, ...props}) => {
    const appContext = useContext(AppContext);

    return (
        <td>
            <div className="d-flex">
                <input className="flex-grow-1 form-control" type={type || 'text'} value={value || ''}
                       maxLength={maxLength} {...props} onChange={(e) =>
                    appContext.updateField(appContext.entityId, name, e.target.value)}/>
            </div>
        </td>
    );
};

export default TextField;