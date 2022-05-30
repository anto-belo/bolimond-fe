import React from 'react';

const SelectPropertyValue = ({values, onChange, selected}) => {
    return (
        <select className="form-select-sm flex-grow-1" onChange={onChange} defaultValue={selected}>
            {values.map((value, index) =>
                <option key={index} value={index}>{value}</option>
            )}
        </select>
    );
};

export default SelectPropertyValue;