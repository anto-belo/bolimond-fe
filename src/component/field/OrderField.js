import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";

const OrderField = ({name, value}) => {
    const appContext = useContext(AppContext);

    const enableControls = appContext.firstOrdered <= value && value <= appContext.lastOrdered;
    const showUp = enableControls && value !== appContext.firstOrdered;
    const showDown = enableControls && value !== appContext.lastOrdered;

    return (
        <td>
            <div className="d-flex">
                <input type="number" className='w-50 flex-grow-1 form-control' value={value} disabled={!enableControls}
                       onChange={(e) => {
                           let newVal = Number(e.target.value);
                           if (value < newVal) {
                               newVal += 1;
                           }
                           appContext.updateField(appContext.entityId, 'seqPosition', newVal);
                       }}
                />
                <div className='seq-chevron-group d-flex align-items-center'>
                    <i className={`fas fa-chevron-down ms-2 ${!showDown && 'invisible'}`}
                       onClick={() => appContext.updateField(appContext.entityId, name, value + 2)}/>
                    <i className={`fas fa-chevron-up ms-1 ${!showUp && 'invisible'}`}
                       onClick={() => appContext.updateField(appContext.entityId, name, value - 1)}/>
                </div>
            </div>
        </td>
    );
};

export default OrderField;