import {useContext, useState} from 'react';
import bcrypt from 'bcryptjs';
import {AuthContext} from '../../context/AuthContext';
import {UserService} from '../../api/UserService';
import ProcessingButtonSpinner from '../../component/ProcessingButtonSpinner';

const PasswordChange = () => {
    const authUser = useContext(AuthContext);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [processing, setProcessing] = useState(false);

    return (
        <div className="row">
            <div className="col">
                <h1 className='text-center'>Change password</h1>
                <div className="d-flex flex-column justify-content-between mt-4 mx-auto"
                     style={{height: '140px', width: '230px'}}>
                    <div className="input-group">
                        <input className="form-control" type="password" placeholder="Old password" value={oldPassword}
                               onChange={(e) => setOldPassword(e.target.value)}/>
                    </div>
                    <div className="input-group">
                        <input className="form-control" type="password" placeholder="New password" value={newPassword}
                               onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>
                    <button className="btn btn-primary" type="button" onClick={() => {
                        setProcessing(true);

                        if (oldPassword === newPassword) {
                            alert('Passwords are the same');
                            setProcessing(false);
                            return;
                        }

                        UserService.updatePassword(authUser.id, oldPassword, bcrypt.hashSync(newPassword, 12))
                            .then(() => {
                                alert("Password successfully changed");
                                setProcessing(false);
                                setOldPassword('');
                                setNewPassword('');
                            })
                            .catch((e) => {
                                alert(e.response.data);
                                setProcessing(false);
                            });
                    }}>
                        <ProcessingButtonSpinner processing={processing} text='Change'/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordChange;