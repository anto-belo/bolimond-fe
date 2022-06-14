import {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";
import CheckboxField from "../../../component/field/CheckboxField";
import ColorField from "../../../component/field/ColorField";
import DeleteField from "../../../component/field/DeleteField";
import ImageField from "../../../component/field/ImageField";
import OrderField from "../../../component/field/OrderField";
import SelectField from "../../../component/field/SelectField";
import TextField from "../../../component/field/TextField";
import BlockTypeField from "../../../component/field/BlockTypeField";

const Slide = ({id, type, content, seqPos, additional, color, linkToProjectId, fixed}) => {
    const appContext = useContext(AppContext);

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <BlockTypeField type={type}/>
                {type === 'IMAGE'
                    ? <ImageField name='content' value={content} fullPhoto={false}/>
                    : <TextField name='content' value={content} maxLength={1000}/>
                }
                <ColorField name='color' value={color}/>
                <SelectField name='linkToProjectId' value={linkToProjectId} valueMap={appContext.projectOptions}
                             optional/>
                <TextField name='additional' value={additional} maxLength={300}/>
                <OrderField name='seqPosition' value={seqPos}/>
                <CheckboxField name='fixed' value={fixed}/>
                <DeleteField/>
            </tr>
        </AppContext.Provider>
    );
};

export default Slide;