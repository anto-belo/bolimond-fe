import React, {useMemo, useState} from 'react';
import bcrypt from "bcryptjs"
import User from "./User";
import {useViewModel} from "../../hook/useViewModel";
import {useEntityPageLoader} from "../../hook/useEntityPageLoader";
import ResponsiveButtonBarOld from "../../component/ResponsiveButtonBarOld";
import {DEFAULT_PAGE_SIZE} from "../../api/config";
import {UserService} from "../../api/UserService";

const Users = () => {
    const [users, setUsers] = useState([]);

    const [allLoaded, onLoadMore] = useEntityPageLoader(
        UserService.getByPage, DEFAULT_PAGE_SIZE, users, setUsers
    );

    const [newUsers, userUpdates, onAddUser, onDeleteUser, onFieldChange, applyChangeSet] = useViewModel(
        users, setUsers, {
            username: '',
            password: '',
            root: false
        }
    );

    const addButtons = useMemo(() => [
        {
            title: 'Add user',
            callback: onAddUser
        }
    ]);

    function onApplyChanges() {
        if (newUsers.filter(u => u.username.trim() !== '' && u.password.trim() !== '').length === 0
            && userUpdates.filter(u => u.username ? u.username.trim() !== '' : true).length === 0) {
            alert("Nothing to update or some fields are blank");
            return;
        }
        if (!uniqueUsernames()) {
            alert("Usernames must be unique");
            return;
        }

        const changeSet = {};
        changeSet.newEntities = newUsers.map(u => {
            return {
                username: u.username,
                password: bcrypt.hashSync(u.password, 12),
                root: u.root
            };
        });

        changeSet.entityUpdates = userUpdates.map(u => {
            return {
                ...u,
                password: bcrypt.hashSync(u.password, 12)
            };
        });
        UserService.update(changeSet)
            .then(() => {
                alert("Changes successfully saved");
                applyChangeSet();
            })
            .catch((e) => alert(e.message));
    }

    function uniqueUsernames() {
        const usernames = [...users, ...newUsers]
            .map(u => u.username)
            .filter(name => name);
        return usernames.length === new Set(usernames).size;
    }

    return (
        <div className="row">
            <div className="col">
                <h1>Users</h1>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="w-60">Username</th>
                            <th>New password</th>
                            <th>Delete/Root</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[...users, ...newUsers].map(u =>
                            <User key={u.id} id={u.id} username={u.username} root={u.root} setField={onFieldChange}
                                  onDelete={onDeleteUser}/>
                        )}
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBarOld onLoadMore={onLoadMore} addButtons={addButtons} onApplyChanges={onApplyChanges}
                                        allLoaded={allLoaded}/>
            </div>
        </div>
    );
};

export default Users;