import {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";
import CheckboxField from "../../../component/field/CheckboxField";
import ColorField from "../../../component/field/ColorField";
import DeleteField from "../../../component/field/DeleteField";
import ImageField from "../../../component/field/ImageField";
import OrderField from "../../../component/field/OrderField";
import SelectField from "../../../component/field/SelectField";
import TextField from "../../../component/field/TextField";

const Slide = ({id, type, content, seqPos, additional, color, linkToProjectId, fixed, last}) => {
    const appContext = useContext(AppContext);

    return (
        <AppContext.Provider value={{...appContext, entityId: id}}>
            <tr>
                <td className='text-center'>
                    {type === 'IMAGE'
                        ? <i className="fas fa-image"/>
                        : type === 'CODE'
                            ? <i className="fas fa-code"/>
                            : <i className="fas fa-file-alt"/>
                    }
                </td>
                {type === 'IMAGE'
                    ? <ImageField name='content' value={content}/>
                    : <TextField name='content' value={content} maxLength={1000}/>
                }
                <ColorField name='color' value={color}/>
                <SelectField name='linkToProjectId' value={linkToProjectId} valueMap={appContext.projectOptions}/>
                <TextField name='additional' value={additional} maxLength={300}/>
                <OrderField seqPos={seqPos} last={last}/>
                <CheckboxField name='fixed' value={fixed}/>
                <DeleteField onDeleteEntity={() => appContext.delete}/>
            </tr>
        </AppContext.Provider>
    );
};

export default Slide;