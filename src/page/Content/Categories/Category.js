import {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";
import SelectField from "../../../component/SelectField";
import OrderField from "../../../component/OrderField";

const Category = ({id, title, url, sectionId, description, seqPos, active, last}) => {
    const appContext = useContext(AppContext);

    return (
        <tr>
            <td>
                <div className="d-flex">
                    <input className="flex-grow-1" type="text" value={title} maxLength="255"
                           onChange={(e) => appContext.updateField(id, "title", e.target.value)}/>
                </div>
            </td>
            <td>
                <div className="d-flex">
                    <input className="flex-grow-1" type="text" value={url} maxLength="255"
                           onChange={(e) => appContext.updateField(id, "url", e.target.value)}/>
                </div>
            </td>
            <SelectField valueMap={appContext.sectionOptions} selected={sectionId}
                         onChange={(secId) => {
                             let selectedSection = appContext.sectionOptions.find(s => s.id === secId);
                             if (selectedSection.categories.includes(title)) {
                                 alert(`Section ${selectedSection.title} already has category titled ${title}`);
                             } else {
                                 appContext.updateField(id, "sectionId", secId);
                             }
                         }}/>
            <td>
                <div className="d-flex">
                    <input className="flex-grow-1" type="text" value={description} maxLength="500"
                           onChange={(e) => appContext.updateField(id, "description", e.target.value)}/>
                </div>
            </td>
            <OrderField id={id} seqPos={seqPos} last={last}/>
            <td className="text-center">
                <input type="checkbox" checked={active} onChange={() => appContext.updateField(id, "active", !active)}/>
            </td>
            <td className="text-center">
                <i className="fas fa-trash-alt action-icon delete-icon" onClick={() => appContext.deleteCategory(id)}/>
            </td>
        </tr>
    );
};

export default Category;