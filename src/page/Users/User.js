import {useContext} from 'react';
import {AppContext} from "../../context/AppContext";
import CheckboxField from "../../component/field/CheckboxField";
import DeleteField from "../../component/field/DeleteField";
import TextField from "../../component/field/TextField";

const User = ({id, username, password, root, authUser}) => {
    const appContext = useContext(AppContext);

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <TextField name='username' value={username} maxLength={255}/>
                <TextField name='password' value={password} maxLength={255} type='password'/>
                <CheckboxField name='root' value={root}
                               nonCheckableReason={authUser && 'You cannot change your own root status'}/>
                <DeleteField nonRemovableReason={authUser && 'You cannot delete yourself'}/>
            </tr>
        </AppContext.Provider>
    );
};

export default User;