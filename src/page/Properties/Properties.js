import {useState} from 'react';
import {useEntityPageLoader} from "../../hook/useEntityPageLoader";
import {useViewModel} from "../../hook/useViewModel";
import {AppContext} from "../../context/AppContext";
import Property from "./Property";
import ResponsiveButtonBar from "../../component/ResponsiveButtonBar";
import {PropertyService} from "../../api/PropertyService";
import {checkBlankStringFields, checkUniqueByField} from "../../util/validationUtils";
import {propertyTooltips} from "./propertyTooltips";
import {DEFAULT_PAGE_SIZE} from "../../api/config";

const Properties = () => {
    const [properties, setProperties]
        = useState([]);
    const [propertyUpdates, addProperty, deleteProperty, updateField, syncChanges]
        = useViewModel(properties, setProperties, () => ({
            title: '',
            value: '',
            type: 'STRING',
            removable: true
        })
    );
    const [allLoaded, onLoadMore]
        = useEntityPageLoader(PropertyService.getProperties, DEFAULT_PAGE_SIZE, properties, setProperties);

    function onApplyChanges() {
        const newProperties = properties.filter(p => p.id < 0);
        if ((newProperties.length === 0 && propertyUpdates.length === 0)
            || !newProperties.every(s => checkBlankStringFields(s, ['title', 'value'], true))
            || !propertyUpdates.every(s => checkBlankStringFields(s, ['title', 'value'], false))) {
            alert("Nothing to update or some fields are blank");
            return;
        }

        if (!checkUniqueByField(properties, 'title')) {
            alert("Property titles must be unique");
            return;
        }

        propertyUpdates.filter(u => !u.delete).forEach(u => {
            const baseProperty = properties.find(p => p.id === u.id);
            u.type = baseProperty.type;
            u.removable = baseProperty.removable
        });

        if (![...newProperties, ...propertyUpdates.filter(u => u.removable && u.hasOwnProperty('value'))]
            .every(p => p.title.match('[A-Z][A-Z0-9_]{0,254}'))) {
            alert("Custom property title must be in upper case, start with letter " +
                "and can contain 1-255 symbols A-Z, 0-9 or _ (underscore)");
            return;
        }

        const changeSet = {
            newEntities: newProperties.map(p => ({
                title: p.title,
                value: p.value
            })),
            entityUpdates: propertyUpdates.map(u => {
                if (u.delete) {
                    return {
                        id: u.id,
                        delete: true
                    };
                }
                return u;
            })
        };

        PropertyService.update(changeSet)
            .then((r) => {
                alert("Changes successfully saved");
                syncChanges(r.data);
            })
            .catch((e) => alert(e.response.data));
    }

    return (
        <div className="row">
            <div className="col">
                <h1>App properties</h1>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Property</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        <AppContext.Provider value={{
                            updateField: updateField,
                            deleteEntity: deleteProperty
                        }}>
                            {properties.map(p =>
                                <Property key={p.id} id={p.id} title={p.title} value={p.value} type={p.type}
                                          custom={p.removable} tooltip={propertyTooltips.get(p.id)}/>
                            )}
                        </AppContext.Provider>
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} allLoaded={allLoaded}>
                    <button className="btn btn-info text-white" type="button" onClick={addProperty}>
                        <i className="fas fa-plus"/>&nbsp;Add property
                    </button>
                    <button className="btn btn-success" type="button" onClick={onApplyChanges}>
                        <i className="fas fa-check"/>&nbsp;Apply changes
                    </button>
                </ResponsiveButtonBar>
            </div>
        </div>
    );
};

export default Properties;