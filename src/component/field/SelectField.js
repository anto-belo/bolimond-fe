import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";

const SelectField = ({name, value, valueMap, onChange}) => {
    const appContext = useContext(AppContext);

    return (
        <td className='text-center'>
            <select className="form-select-sm flex-grow-1" value={value}
                    onChange={(e) => {
                        if (onChange) {
                            onChange(e.target.value);
                        } else {
                            appContext.updateField(appContext.entityId, name, e.target.value);
                        }
                    }}>
                <option value='0'/>
                {valueMap?.map(entry =>
                    <option key={entry.id} value={entry.id}>{entry.value}</option>
                )}
            </select>
        </td>
    );
};

export default SelectField;