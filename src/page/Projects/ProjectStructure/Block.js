import {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";
import BlockTypeField from "../../../component/field/BlockTypeField";
import DeleteField from "../../../component/field/DeleteField";
import ImageField from "../../../component/field/ImageField";
import OrderField from "../../../component/field/OrderField";
import SelectField from "../../../component/field/SelectField";
import TextField from "../../../component/field/TextField";

const Block = ({id, type, projectId, content, seqPos, additional, isNewProject}) => {
    const appContext = useContext(AppContext);

    const titleBlock = type === 'TITLE';

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <BlockTypeField type={type}/>
                {type === 'IMAGE' || titleBlock
                    ? <ImageField name='content' value={content} fullPhoto={false}/>
                    : <TextField name='content' value={content} maxLength={1000}/>
                }
                <TextField name='additional' value={additional} maxLength={300}/>
                {!isNewProject &&
                    <SelectField name='projectId' value={projectId} valueMap={appContext.projectOptions}/>}
                <OrderField name='seqPosition' value={seqPos}/>
                <DeleteField nonRemovableReason={titleBlock ? 'Title block is non-removable' : undefined}/>
            </tr>
        </AppContext.Provider>
    );
};

export default Block;