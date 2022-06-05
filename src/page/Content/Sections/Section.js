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
                    ? <button className="btn btn-primary btn-sm" type="button" data-bs-target="#section-editor-modal"
                              data-bs-toggle="modal" data-bs-sec-id={id} data-bs-sec-title={title}>Edit</button>
                    : <i className="fas fa-times"/>
                }
            </td>
            <td>
                <div className="d-flex">
                    <input type="number" className='w-50' value={seqPos}
                           onChange={(e) => {
                               let newVal = Number(e.target.value);
                               if (seqPos < newVal) {
                                   newVal += 1;
                               }
                               appContext.updateField(id, 'seqPosition', newVal);
                           }}
                    />
                    <div className='seq-chevron-group'>
                        <i className={`fas fa-chevron-down ms-2 ${last && 'invisible'}`}
                           onClick={() => appContext.updateField(id, 'seqPosition', seqPos + 2)}/>
                        <i className={`fas fa-chevron-up ms-1 ${first && 'invisible'}`}
                           onClick={() => appContext.updateField(id, 'seqPosition', seqPos - 1)}/>
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