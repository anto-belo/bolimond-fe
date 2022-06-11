import {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";
import CheckboxField from "../../../component/field/CheckboxField";
import DeleteField from "../../../component/field/DeleteField";
import OrderField from "../../../component/field/OrderField";
import TextField from "../../../component/field/TextField";

const Section = ({id, title, url, custom, seqPos, active, removable, last}) => {
    const appContext = useContext(AppContext);

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <TextField name='title' value={title} maxLength={255}/>
                <TextField name='url' value={url} maxLength={255}/>
                <td className='text-center'>
                    {custom
                        ?
                        <button className="btn btn-primary btn-sm" type="button" data-bs-target="#section-editor-modal"
                                data-bs-toggle="modal" data-bs-sec-id={id} data-bs-sec-title={title}>Edit</button>
                        : <i className="fas fa-times"/>
                    }
                </td>
                <OrderField seqPos={seqPos} last={last}/>
                <CheckboxField name='active' value={active}/>
                <DeleteField nonRemovableReason={!removable && 'This section has categories'}/>
            </tr>
        </AppContext.Provider>
    );
};

export default Section;