import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";

const ColorField = ({name, value}) => {
    const appContext = useContext(AppContext);

    return (
        <td>
            <div className="d-flex">
                <input className="flex-grow-1" type="color" value={value}
                       onChange={(e) => appContext.updateField(appContext.entityId, name, e.target.value)}/>
            </div>
        </td>
    );
};

export default ColorField;