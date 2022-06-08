import React from 'react';

const SelectField = ({valueMap, onChange, selected}) => {
    return (
        <td className='text-center'>
            <select className="form-select-sm flex-grow-1" value={selected}
                    onChange={(e) => onChange(e.target.value)}>
                <option value='0'/>
                {valueMap?.map(entry =>
                    <option key={entry.id} value={entry.id}>{entry.value}</option>
                )}
            </select>
        </td>
    );
};

export default SelectField;