import {useContext} from 'react';
import {AppContext} from '../../context/AppContext';
import SelectField from '../../component/field/SelectField';
import TextField from "../../component/field/TextField";
import ToggleField from '../../component/field/ToggleField';
import {selectPropertyValues} from './selectPropertyValues';
import './selectPropertyValues';

const Property = ({id, title, value, type, custom, tooltip}) => {
    const appContext = useContext(AppContext);

    const valueInputType = type === 'STRING' ? 'text' : 'number';
    const valueMap = selectPropertyValues.get(id)?.map((v, i) => ({id: i, value: v}));

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <td>
                    <div className='d-flex justify-content-between align-items-center'>
                        {custom ? <>
                            <input className='flex-grow-1 form-control' type='text' value={title}
                                   onChange={(e) =>
                                       appContext.updateField(id, 'title', e.target.value)}/>
                            <i className='fas fa-trash-alt ms-3 action-icon delete-icon'
                               onClick={() => appContext.deleteEntity(id)}/>
                        </> : <>
                            <div className='justify-content-between align-items-center justify-content-sm-start
                                                d-flex w-100'>
                                <p className='my-1'>{title}</p>
                                {tooltip &&
                                    <i className='fas fa-question-circle text-black-50 ms-1' title={tooltip}/>
                                }
                            </div>
                            <i className='fas fa-lock text-black-50 ms-3' title='This property cannot be deleted.'/>
                        </>}
                    </div>
                </td>
                {valueMap
                    ? <SelectField name='value' value={value} valueMap={valueMap}/>
                    : type === 'BOOLEAN'
                        ? <ToggleField name='value' value={value}/>
                        : <TextField name='value' value={value} type={valueInputType} min={0} maxLength={255}/>
                }
            </tr>
        </AppContext.Provider>
    );
};

export default Property;