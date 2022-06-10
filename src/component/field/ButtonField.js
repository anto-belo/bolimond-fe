import React from 'react';

const ButtonField = ({title}) => {
    return (
        <td>
            <div className="d-flex">
                <button className="btn btn-primary btn-sm flex-grow-1" type="button">{title}</button>
            </div>
        </td>
    );
};

export default ButtonField;