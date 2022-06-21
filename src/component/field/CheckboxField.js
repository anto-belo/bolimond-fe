import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";

const CheckboxField = ({name, value, nonCheckableReason}) => {
    const appContext = useContext(AppContext);

    return (
        <td className='text-center'>
            <input type="checkbox" checked={value} disabled={!!nonCheckableReason} title={nonCheckableReason || ''}
                   onChange={() => appContext.updateField(appContext.entityId, name, !value)}/>
        </td>
    );
};

export default CheckboxField;