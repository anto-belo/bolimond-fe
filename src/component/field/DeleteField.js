import {useContext} from "react";
import {AppContext} from "../../context/AppContext";

const DeleteField = ({nonRemovableReason}) => {
    const appContext = useContext(AppContext);

    return (
        <td className='text-center'>
            {nonRemovableReason
                ? <i className='fas fa-lock' title={nonRemovableReason}/>
                : <i className="fas fa-trash-alt action-icon delete-icon"
                   onClick={() => appContext.deleteEntity(appContext.entityId)}/>
            }
        </td>
    );
};

export default DeleteField;