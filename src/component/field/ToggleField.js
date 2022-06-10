import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";

const ToggleField = ({name, value}) => {
    const appContext = useContext(AppContext);

    const btnOutlineStyle = value === '1' ? 'btn-secondary' : 'btn-outline-secondary';

    return (
        <td>
            <div className="d-flex">
                <button className={`btn btn-sm flex-grow-1 ${btnOutlineStyle}`} type="button"
                        onClick={() => appContext.updateField(appContext.entityId, name, value === '1' ? '0' : '1')}>
                    {value === '1' ? 'Enabled' : 'Disabled'}
                </button>
            </div>
        </td>
    );
};

export default ToggleField;