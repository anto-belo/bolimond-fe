import React, {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";

const Section = ({id, title, url, custom, seqPos, active, first, last}) => {
    const appContext = useContext(AppContext);

    return (
        <tr>
            <td>
                <div className="d-flex">
                    <input className="flex-grow-1" type="text" value={title} maxLength="255"
                           onChange={(e) => appContext.updateField(id, "title", e.target.value)}/>
                </div>
            </td>
            <td>
                <div className="d-flex">
                    <input className="flex-grow-1" type="text" value={url} maxLength="255"
                           onChange={(e) => appContext.updateField(id, "url", e.target.value)}/>
                </div>
            </td>
            <td className='text-center'>
                {custom
                    ? <button className="btn btn-primary btn-sm" type="button">Edit</button>
                    : <i className="fas fa-times"/>
                }
            </td>
            <td>
                <div className="d-flex justify-content-between">
                    <p className="my-0">{seqPos}</p>
                    <div className='seq-chevron-group'>
                        <i className={`fas fa-chevron-down me-1 ${last && 'invisible'}`}
                           onClick={() => appContext.moveDown(id)}/>
                        <i className={`fas fa-chevron-up ${first && 'invisible'}`}
                           onClick={() => appContext.moveUp(id)}/>
                    </div>
                </div>
            </td>
            <td className="text-center">
                <input type="checkbox" checked={active} onChange={() => appContext.updateField(id, "active", !active)}/>
            </td>
            <td className="text-center">
                <i className="fas fa-trash-alt delete-icon" onClick={() => appContext.deleteSection(id)}/>
            </td>
        </tr>
    );
};

export default Section;