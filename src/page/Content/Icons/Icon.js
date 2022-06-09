import {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";
import TextField from "../../../component/field/TextField";
import ImageField from "../../../component/field/ImageField";
import OrderField from "../../../component/field/OrderField";
import CheckboxField from "../../../component/field/CheckboxField";
import DeleteField from "../../../component/field/DeleteField";

const Icon = ({id, title, pic, linkToUrl, seqPos, active, last}) => {
    const appContext = useContext(AppContext);

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <TextField name='title' value={title} maxLength={255}/>
                <ImageField name='pic' value={pic} fullPhoto={true}/>
                <TextField name='linkToUrl' value={linkToUrl} maxLength={255}/>
                <OrderField seqPos={seqPos} last={last}/>
                <CheckboxField name='active' value={active}/>
                <DeleteField/>
            </tr>
        </AppContext.Provider>
    );
};

export default Icon;