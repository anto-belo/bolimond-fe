import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";
import CheckboxField from "../../component/field/CheckboxField";
import DeleteField from "../../component/field/DeleteField";
import TextField from "../../component/field/TextField";

const User = ({id, username, password, root}) => {
    const appContext = useContext(AppContext);

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <TextField name='username' value={username} maxLength={255}/>
                <TextField name='password' value={password} maxLength={255} password/>
                <CheckboxField name='root' value={root}/>
                <DeleteField/>
            </tr>
        </AppContext.Provider>
    );
};

export default User;