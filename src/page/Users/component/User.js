import React from 'react';

const User = ({id, username, root, setField, onDelete}) => {
    return (
        <tr>
            <td>
                <div className="d-flex">
                    <input className="flex-grow-1" type="text" value={username}
                           onChange={(e) => setField(id, "username", e.target.value)}/>
                </div>
            </td>
            <td>
                <div className="d-flex">
                    <input className="flex-grow-1" type="password"
                           onChange={(e) => setField(id, "password", e.target.value)}/>
                </div>
            </td>
            <td>
                <i className="fas fa-trash-alt me-3" onClick={() => onDelete(id)}/>
                <input type="checkbox" checked={root}
                       onChange={() => {
                           console.log("changed")
                           setField(id, "root", !root)
                       }}/>
            </td>
        </tr>
    );
};

export default User;