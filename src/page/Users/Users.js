import {useState} from 'react';
import bcrypt from "bcryptjs"
import {useEntityPageLoader} from "../../hook/useEntityPageLoader";
import {useViewModel} from "../../hook/useViewModel";
import {AppContext} from "../../context/AppContext";
import User from "./User";
import ResponsiveButtonBar from "../../component/ResponsiveButtonBar";
import ProcessingButtonSpinner from "../../component/ProcessingButtonSpinner";
import {UserService} from "../../api/UserService";
import {checkBlankStringFields, checkUniqueByField} from "../../util/validationUtils";
import {DEFAULT_PAGE_SIZE} from "../../api/config";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [userUpdates, addUser, deleteUser, updateField, syncChanges] = useViewModel(users, setUsers, () => ({
        username: '',
        password: '',
        root: false
    }));
    const [allLoaded, onLoadMore] = useEntityPageLoader(UserService.getByPage, DEFAULT_PAGE_SIZE, users, setUsers);

    function onApplyChanges() {
        setProcessing(true);
        const newUsers = users.filter(u => u.id < 0);
        if ((newUsers.length === 0 && userUpdates.length === 0)
            || !newUsers.every(u => checkBlankStringFields(u, ['username', 'password'], true))
            || !userUpdates.every(u => checkBlankStringFields(u, ['username'], false))) {
            alert("Nothing to update or some fields are blank (set password for new users)");
            setProcessing(false);
            return;
        }

        if (!checkUniqueByField(users, 'username')) {
            alert("Usernames must be unique");
            setProcessing(false);
            return;
        }

        const changeSet = {
            newEntities: newUsers.map(u => ({
                username: u.username,
                password: bcrypt.hashSync(u.password, 12),
                root: u.root
            })),
            entityUpdates: userUpdates.map(u => {
                if (u.delete) {
                    return {
                        id: u.id,
                        delete: true
                    };
                }
                if (u.password) {
                    return {
                        ...u,
                        password: bcrypt.hashSync(u.password, 12)
                    };
                } else {
                    delete u.password;
                    if (Object.keys(u).length === 1 && u.hasOwnProperty('id')) {
                        return;
                    }
                    return u;
                }
            }).filter(u => u)
        };

        if (changeSet.newEntities.length === 0 && changeSet.entityUpdates.length === 0) {
            alert("Nothing to update or some fields are blank");
            setProcessing(false);
            return;
        }

        UserService.update(changeSet)
            .then((r) => {
                alert("Changes successfully saved");
                setProcessing(false);
                syncChanges(r.data);
                users.forEach(u => u.password = '');
                setUsers([...users]);
            })
            .catch((e) => {
                alert(e.response.data);
                setProcessing(false);
            });
    }

    return (
        <div className="row">
            <div className="col">
                <h1>Users</h1>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>New password</th>
                            <th>Root</th>
                            <th>Delete</th>
                        </tr>
                        </thead>
                        <tbody>
                        <AppContext.Provider value={{
                            updateField: updateField,
                            deleteEntity: deleteUser
                        }}>
                            {users.map(u =>
                                <User key={u.id} id={u.id} username={u.username} password={u.password} root={u.root}/>
                            )}
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} allLoaded={allLoaded}>
                    <button className="btn btn-info text-white" type="button" onClick={addUser}>
                        <i className="fas fa-plus"/>&nbsp;Add user
                    </button>
                    <button className="btn btn-success" type="button" onClick={onApplyChanges}>
                        <i className="fas fa-check"/>&nbsp;
                        <ProcessingButtonSpinner processing={processing} text='Apply changes'/>
                    </button>
                </ResponsiveButtonBar>
            </div>
        </div>
    );
};

export default Users;