import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";
import ButtonField from "../../component/field/ButtonField";
import CheckboxField from "../../component/field/CheckboxField";
import ColorField from "../../component/field/ColorField";
import OrderField from "../../component/field/OrderField";
import SelectField from "../../component/field/SelectField";
import TextField from "../../component/field/TextField";

const Project = ({id, title, url, categoryId, color, keyWords, seqPos, active, fixed, last}) => {
    const appContext = useContext(AppContext);

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <TextField name='title' value={title} maxLength={255}/>
                <TextField name='url' value={url} maxLength={255}/>
                <SelectField name='categoryId' value={categoryId} valueMap={appContext.categoryOptions}/>
                <ColorField name='color' value={color}/>
                <TextField name='keyWords' value={keyWords} maxLength={255}/>
                <OrderField seqPos={seqPos} last={last}/>
                <CheckboxField name='active' value={active}/>
                <CheckboxField name='fixed' value={fixed}/>
                <ButtonField title='Edit' data-bs-target="#project-editor-modal" data-bs-toggle="modal"
                             data-bs-project-id={id} data-bs-project-title={title}/>
            </tr>
        </AppContext.Provider>
    );
};

export default Project;