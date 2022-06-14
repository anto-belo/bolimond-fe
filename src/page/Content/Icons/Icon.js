import {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";
import CheckboxField from "../../../component/field/CheckboxField";
import DeleteField from "../../../component/field/DeleteField";
import ImageField from "../../../component/field/ImageField";
import OrderField from "../../../component/field/OrderField";
import TextField from "../../../component/field/TextField";

const Icon = ({id, title, pic, linkToUrl, seqPos, active}) => {
    const appContext = useContext(AppContext);

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <TextField name='title' value={title} maxLength={255}/>
                <ImageField name='pic' value={pic} fullPhoto={true}/>
                <TextField name='linkToUrl' value={linkToUrl} maxLength={255}/>
                <OrderField name='seqPosition' value={seqPos}/>
                <CheckboxField name='active' value={active}/>
                <DeleteField/>
            </tr>
        </AppContext.Provider>
    );
};

export default Icon;