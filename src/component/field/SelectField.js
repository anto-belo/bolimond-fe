import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";

const SelectField = ({name, value, valueMap, onChange, optional, disabled}) => {
    const appContext = useContext(AppContext);

    return (
        <td className='text-center'>
            <div className="d-flex">
                <select className="form-select flex-grow-1" value={value || ''} disabled={disabled}
                        onChange={(e) => {
                            if (onChange) {
                                onChange(e.target.value);
                            } else {
                                appContext.updateField(appContext.entityId, name, e.target.value);
                            }
                        }}>
                    {optional && <option value='0'/>}
                    {valueMap?.map(entry =>
                        <option key={entry.id} value={entry.id}>{entry.value}</option>
                    )}
                </select>
            </div>
        </td>
    );
};

export default SelectField;