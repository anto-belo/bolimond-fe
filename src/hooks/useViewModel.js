import {useState} from 'react';

export const useViewModel = (entities, setEntities, newEntityTemplate, baseUpdater) => {
    const [entityUpdates, setEntityUpdates] = useState([]);
    const [newEntities, setNewEntities] = useState([]);

    function onAddEntity() {
        setNewEntities([...newEntities, {
            id: Math.round(-Math.random() * 100_000_000 + 1),
            ...newEntityTemplate
        }]);
    }

    function onDeleteEntity(id) {
        const entity = (id > 0 ? entities : newEntities).find(e => e.id === id);
        if (!entity) return;

        if (id > 0) {
            setEntities([...entities.filter(e => e.id !== id)]);
            addFieldUpdate(id, "delete", true);
        } else {
            setNewEntities([...newEntities.filter(e => e.id !== id)])
        }
    }

    function addFieldUpdate(id, field, value) {
        let entityUpdate = entityUpdates.find(e => e.id === id);
        if (entityUpdate) {
            entityUpdate[field] = value;
            setEntityUpdates([...entityUpdates]);
        } else {
            const entity = (id > 0 ? entities : newEntities).find(e => e.id === id);
            if (!entity) return;

            entityUpdate = {id: id};
            if (baseUpdater) {
                baseUpdater(entity);
            }
            entityUpdate[field] = value;
            setEntityUpdates([...entityUpdates, entityUpdate]);
        }
    }

    function onFieldChange(id, field, value) {
        const entity = (id > 0 ? entities : newEntities).find(e => e.id === id);
        if (!entity) return;

        entity[field] = value;
        if (id > 0) {
            setEntities([...entities]);
            addFieldUpdate(id, field, value);
        } else {
            setNewEntities([...newEntities]);
        }
    }

    function applyChangeSet() {
        setEntities([...entities, ...newEntities]);
        setNewEntities([]);
        setEntityUpdates([]);
    }

    return [newEntities, entityUpdates, onAddEntity, onDeleteEntity, onFieldChange, applyChangeSet];
};
