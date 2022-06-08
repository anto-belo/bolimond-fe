import {useContext} from 'react';
import {AppContext} from "../../../context/AppContext";
import SelectField from "../../../component/field/SelectField";
import OrderField from "../../../component/field/OrderField";

const Category = ({id, title, url, sectionId, description, seqPos, active, last}) => {
    const appContext = useContext(AppContext);

    return (
        <tr>
            <td>
                <div className="d-flex">
                    <input className="flex-grow-1" type="text" value={title} maxLength="255"
                           onChange={(e) => appContext.updateField(id, "title", e.target.value)}
                           onBlur={() => {
                               if (sectionId !== 0 && appContext.categorySectionInconsistency(sectionId, id)) {
                                   alert(`Category section already has a category with title '${title}'`);
                                   appContext.updateField(id, "sectionId", 0);
                               }
                           }}/>
                </div>
            </td>
            <td>
                <div className="d-flex">
                    <input className="flex-grow-1" type="text" value={url} maxLength="255"
                           onChange={(e) => appContext.updateField(id, "url", e.target.value)}
                           onBlur={() => {
                               if (sectionId !== 0 && appContext.categorySectionInconsistency(sectionId, id)) {
                                   alert(`Category section already has a category with URL '${url}'`);
                                   appContext.updateField(id, "sectionId", 0);
                               }
                           }}/>
                </div>
            </td>
            <SelectField valueMap={appContext.sectionOptions} value={sectionId}
                         onChange={(secId) => {
                             secId = Number(secId);
                             const errType = appContext.categorySectionInconsistency(secId, id);
                             if (!errType) {
                                 appContext.updateField(id, "sectionId", secId);
                             } else {
                                 if (errType === 'title')
                                     alert(`Chosen section already has a category with title '${title}'`);
                                 else if (errType === 'url') {
                                     alert(`Chosen section already has a category with URL '${url}'`);
                                 }
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