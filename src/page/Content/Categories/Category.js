import {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";
import CheckboxField from "../../../component/field/CheckboxField";
import DeleteField from "../../../component/field/DeleteField";
import OrderField from "../../../component/field/OrderField";
import SelectField from "../../../component/field/SelectField";
import TextField from "../../../component/field/TextField";

const Category = ({id, title, url, sectionId, description, seqPos, active, removable, last}) => {
    const appContext = useContext(AppContext);

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <TextField name='title' value={title} maxLength={255} onBlur={() => {
                    if (sectionId !== 0 && appContext.categorySectionInconsistency(sectionId, id)) {
                        alert(`Category section already has a category with title '${title}'`);
                        appContext.updateField(id, "sectionId", 0);
                    }
                }}/>
                <TextField name='url' value={url} maxLength={255} onBlur={() => {
                    if (sectionId !== 0 && appContext.categorySectionInconsistency(sectionId, id)) {
                        alert(`Category section already has a category with URL '${url}'`);
                        appContext.updateField(id, "sectionId", 0);
                    }
                }}/>
                <SelectField value={sectionId} valueMap={appContext.sectionOptions} optional
                             onChange={(secId) => {
                                 secId = Number(secId);
                                 const errType = appContext.categorySectionInconsistency(secId, id);
                                 if (!errType) {
                                     appContext.updateField(id, "sectionId", secId);
                                 } else {
                                     if (errType === 'title')
                                         alert(`Chosen section already has a category with title '${title}'`);
                                     else if (errType === 'url') {
                                         alert(`Chosen section already has a category with URL '${url}'`);
                                     }
                                 }
                             }}/>
                <TextField name='description' value={description} maxLength={500}/>
                <OrderField seqPos={seqPos} last={last}/>
                <CheckboxField name='active' value={active}/>
                <DeleteField nonRemovableReason={!removable && 'This category has projects'}/>
            </tr>
        </AppContext.Provider>
    );
};

export default Category;
