import React from 'react';

const ToggleButton = ({value, onChange}) => {
    const btnOutlineStyle = value === '1' ? 'btn-secondary' : 'btn-outline-secondary';

    return (
        <button className={`btn btn-sm flex-grow-1 ${btnOutlineStyle}`} type="button"
                onClick={() => onChange(value === '1' ? '0' : '1')}>
            {value === '1' ? 'Enabled' : 'Disabled'}
        </button>
    );
};

export default ToggleButton;