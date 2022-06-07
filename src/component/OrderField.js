import React, {useContext} from 'react';
import {AppContext} from "../context/AppContext";

const OrderField = ({id, seqPos, last}) => {
    const appContext = useContext(AppContext);

    return (
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
                <div className='seq-chevron-group d-flex align-items-center'>
                    <i className={`fas fa-chevron-down ms-2 ${last && 'invisible'}`}
                       onClick={() => appContext.updateField(id, 'seqPosition', seqPos + 2)}/>
                    <i className={`fas fa-chevron-up ms-1 ${seqPos === 1 && 'invisible'}`}
                       onClick={() => appContext.updateField(id, 'seqPosition', seqPos - 1)}/>
                </div>
            </div>
        </td>
    );
};

export default OrderField;