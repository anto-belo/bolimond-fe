import React, {useState} from 'react';
import Property from "./component/Property";
import {propertyTooltips} from "./config/propertyTooltips";
import {PropertyService} from "../api/PropertyService";
import {PropertyDto} from "./dto/PropertyDto";
import {NewPropertyDto} from "./dto/NewPropertyDto";
import ResponsiveButtonBar from "../component/ResponsiveButtonBar";
import {useEntityPageLoader} from "../hooks/useEntityPageLoader";
import {DEFAULT_PAGE_SIZE} from "../api/config";
import {useViewModel} from "../hooks/useViewModel";

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
        }, (prop: PropertyDto) => {
            return {
                type: prop.type,
                removable: prop.removable
            };
        }
    );

    function onApplyChanges() {
        if (newProps.filter(p => p.title.trim() !== '' && p.value.trim() !== '').length === 0
            && propUpdates.filter(p =>
                (p.value ? p.value.trim() !== '' : true) && (p.title ? p.title.trim() !== '' : true)).length === 0) {
            alert("Nothing to update or some fields are blank");
            return;
        }
        if (!uniquePropertyTitles()) {
            alert("Field titles must be unique");
            return;
        }

        let changeSet = {};
        changeSet.newEntities = newProps.map((p: NewPropertyDto) => {
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
        const customProps = [...properties.filter((p: PropertyDto) => p.removable), ...newProps]
            .map((p: PropertyDto | NewPropertyDto) => p.title)
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
                        {properties.map((p: PropertyDto) =>
                            <Property key={p.id} id={p.id} title={p.title} value={p.value} valueType={p.type}
                                      setField={onFieldChange} custom={p.removable} tooltip={propertyTooltips.get(p.id)}
                                      onDelete={onDeleteProp}/>
                        )}
                        {newProps.map((p: PropertyDto) =>
                            <Property key={p.id} id={p.id} title={p.title} value={p.value} valueType='STRING'
                                      setField={onFieldChange} custom={true} onDelete={onDeleteProp}/>
                        )}
                        </tbody>
                    </table>
                </div>
                <ResponsiveButtonBar onLoadMore={onLoadMore} onAddEntity={onAddProp} onApplyChanges={onApplyChanges}
                                     allLoaded={allLoaded}/>
            </div>
        </div>
    );
};

export default Properties;