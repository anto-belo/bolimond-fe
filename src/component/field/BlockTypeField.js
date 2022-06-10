import React from 'react';

const BlockTypeField = ({type}) => {
    return (
        <td className='text-center'>
            {type === 'IMAGE'
                ? <i className="fas fa-image"/>
                : type === 'CODE'
                    ? <i className="fas fa-code"/>
                    : type === 'TEXT'
                        ? <i className="fas fa-file-alt"/>
                        : 'Title'
            }
        </td>
    );
};

export default BlockTypeField;