import React, {useState} from 'react';
import Property from "./component/Property";
import {useViewModel} from "../../hook/useViewModel";
import {useEntityPageLoader} from "../../hook/useEntityPageLoader";
import ResponsiveButtonBar from "../../component/ResponsiveButtonBar";
import {DEFAULT_PAGE_SIZE} from "../../api/config";
import {PropertyService} from "../../api/PropertyService";
import {propertyTooltips} from "./config/propertyTooltips";

const Properties = () => {
    const [properties, setProperties] = useState([]);

    const [allLoaded, onLoadMore] = useEntityPageLoader(
        PropertyService.getProperties, DEFAULT_PAGE_SIZE, properties, setProperties
    );

    const [newProps, propUpdates, onAddProp, onDeleteProp, onFieldChange, applyChangeSet] = useViewModel(
        properties, setProperties, {
            title: '',
            value: '',
            type: 'STRING',
            removable: true
        }, prop => {
            return {
                type: prop.type,
                removable: prop.removable
            };
        }
    );

    function onApplyChanges() {
        if (newProps.filter(p => p.title.trim() !== '' && p.value.trim() !== '').length === 0
            && propUpdates.filter(p =>
                (p.value ? p.value.trim() !== '' : true) && (p.title ? p.title.trim() !== '' : true)
            ).length === 0) {
            alert("Nothing to update or some fields are blank");
            return;
        }
        if (!uniquePropertyTitles()) {
            alert("Field titles must be unique");
            return;
        }

        const changeSet = {};
        changeSet.newEntities = newProps.map(p => {
            return {
                title: p.title,
                value: p.value
            };
        });
        changeSet.entityUpdates = propUpdates;
        PropertyService.update(changeSet)
            .then(() => {
                alert("Changes successfully saved");
                applyChangeSet();
            })
            .catch((e) => alert(e.message));
    }

    function uniquePropertyTitles() {
        const customProps = [...properties.filter(p => p.removable), ...newProps]
            .map(p => p.title)
            .filter(title => title);
        return customProps.length === new Set(customProps).size;
    }

    return (
        <div className="row">
            <div className="col">
                <h1>App properties</h1>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th className="w-60">Property</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {properties.map(p =>
                            <Property key={p.id} id={p.id} title={p.title} value={p.value} valueType={p.type}
                                      setField={onFieldChange} custom={p.removable} tooltip={propertyTooltips.get(p.id)}
                                      onDelete={onDeleteProp}/>
                        )}
                        {newProps.map(p =>
                            <Property key={p.id} id={p.id} title={p.title} value={p.value} valueType='STRING'
                                      setField={onFieldChange} custom={true} onDelete={onDeleteProp}/>
                        )}
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} onAddEntity={onAddProp} onApplyChanges={onApplyChanges}
                                     entity='property' allLoaded={allLoaded}/>
            </div>
        </div>
    );
};

export default Properties;