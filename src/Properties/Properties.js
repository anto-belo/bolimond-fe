import React, {useEffect, useState} from 'react';
import Property from "./component/Property";
import PropertiesButtonBar from "./component/PropertiesButtonBar";
import {propertyTooltips} from "./config/propertyTooltips";
import {PropertyService} from "../api/PropertyService";
import {PropertyDto} from "./dto/PropertyDto";
import {NewPropertyDto} from "./dto/NewPropertyDto";
import {UpdatePropertyDto} from "./dto/UpdatePropertyDto";

const PAGE_SIZE = 15;

const Properties = () => {
    const [allLoaded, setAllLoaded] = useState(false);
    const [lastLoadedPage, setLastLoadedPage] = useState(0);

    const [properties, setProperties] = useState([]);
    const [propertyUpdates, setPropertyUpdates] = useState([]);
    const [newProperties, setNewProperties] = useState([]);

    useEffect(() => {
        PropertyService.getProperties(lastLoadedPage, PAGE_SIZE)
            .then(r => {
                setAllLoaded(r.data.length < PAGE_SIZE);
                setProperties([...properties, ...r.data]);
            })
            .catch(e => alert(e.message));
    }, [lastLoadedPage]);

    function onLoadMore() {
        setLastLoadedPage(lastLoadedPage + 1);
    }

    function onAddProp() {
        setNewProperties([...newProperties, {
            id: -Math.random() * 100_000_000 + 1,
            title: '',
            value: ''
        }]);
    }

    function onDeleteProp(id) {
        const prop: PropertyDto | NewPropertyDto = (id > 0 ? properties : newProperties)
            .find(p => p.id === id);
        if (!prop) return;

        if (id > 0 && prop.removable) {
            setProperties([...properties.filter(p => p.id !== id)]);
            addPropertyUpdate(id, "delete", true);
        } else {
            setNewProperties([...newProperties.filter(p => p.id !== id)])
        }
    }

    function onApplyChanges() {
        if (newProperties.filter(p => p.title.trim() !== '' && p.value.trim() !== '').length === 0
            && propertyUpdates.filter(p => (p.value ? p.value.trim() !== '' : true)
                && (p.title ? p.title.trim() !== '' : true)).length === 0) {
            alert("Nothing to update or some fields are blank");
            return;
        }
        if (!uniquePropertyTitles()) {
            alert("Field titles must be unique");
            return;
        }

        let changeSet = {};
        changeSet.newEntities = newProperties.map((p: NewPropertyDto) => {
            return {
                title: p.title,
                value: p.value
            };
        });
        changeSet.entityUpdates = propertyUpdates;
        PropertyService.update(changeSet)
            .then(() => {
                alert("Changes successfully saved");
                setProperties([...properties, ...newProperties]);
                setNewProperties([]);
                setPropertyUpdates([]);
            })
            .catch((e) => alert(e.message));
    }

    function setField(id, field, value) {
        const prop: PropertyDto | NewPropertyDto = (id > 0 ? properties : newProperties).find(p => p.id === id);
        if (!prop) return;

        prop[field] = value;
        if (id > 0) {
            setProperties([...properties]);
            addPropertyUpdate(id, field, value);
        } else {
            setNewProperties([...newProperties]);
        }
    }

    function addPropertyUpdate(id, field, value) {
        let propUpdate: UpdatePropertyDto = propertyUpdates.find(p => p.id === id);
        if (propUpdate) {
            propUpdate[field] = value;
            setPropertyUpdates([...propertyUpdates]);
        } else {
            const prop: PropertyDto | NewPropertyDto = (id > 0 ? properties : newProperties).find(p => p.id === id);
            if (!prop) return;

            propUpdate = {
                id: prop.id,
                type: prop.type,
                removable: prop.removable
            };
            propUpdate[field] = value;
            setPropertyUpdates([...propertyUpdates, propUpdate]);
        }
    }

    function uniquePropertyTitles() {
        const customProps = [...properties.filter((p: PropertyDto) => p.removable), ...newProperties]
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
                                      custom={p.removable} tooltip={propertyTooltips.get(p.id)}
                                      setField={setField} onDelete={onDeleteProp}/>
                        )}
                        {newProperties.map((p: PropertyDto) =>
                            <Property key={p.id} id={p.id} title={p.title} value={p.value}
                                      custom={true} setField={setField} onDelete={onDeleteProp}/>
                        )}
                        </tbody>
                    </table>
                </div>
                <PropertiesButtonBar onLoadMore={onLoadMore} onAddProp={onAddProp} onApplyChanges={onApplyChanges}
                                     allLoaded={allLoaded}/>
            </div>
        </div>
    );
};

export default Properties;