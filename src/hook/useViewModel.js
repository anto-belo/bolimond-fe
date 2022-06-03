import {useState} from 'react';

export const useViewModel = (entities, setEntities, entityTemplateFactory, baseUpdater) => {
    const [entityUpdates, setEntityUpdates] = useState([]);

    function addEntity(...args) {
        setEntities([...entities, {
            id: Math.round(-Math.random() * 100_000_000 + 1),
            ...entityTemplateFactory(...args)
        }]);
    }

    function deleteEntity(id) {
        const entity = entities.find(e => e.id === id);
        if (!entity) return;

        setEntities([...entities.filter(e => e.id !== id)]);
        if (id > 0) {
            addFieldUpdate(id, "delete", true);
        }
    }

    function updateField(id, field, value) {
        const entity = entities.find(e => e.id === id);
        if (!entity) return;

        entity[field] = value;
        setEntities([...entities]);
        if (id > 0) {
            addFieldUpdate(id, field, value);
        }
    }

    function syncChanges(savedEntities) {
        setEntities([...entities.filter(e => e.id > 0), ...savedEntities]);
        setEntityUpdates([]);
    }

    function moveUp(id) {
        const seqPos = entities.find(e => e.id === id).seqPosition;
        if (seqPos === 1) return;
        swapWithNext(seqPos - 1);
    }

    function moveDown(id) {
        const seqPos = entities.find(e => e.id === id).seqPosition;
        if (seqPos === entities.length) return;
        swapWithNext(seqPos);
    }

    function swapWithNext(pos) {
        if (!pos || pos < 0 || pos > entities.length - 1) return;

        const prevEntity = entities.find(e => e.seqPosition === pos);
        const nextEntity = entities.find(e => e.seqPosition === pos + 1);

        prevEntity.seqPosition = pos + 1;
        nextEntity.seqPosition = pos;
        setEntities([...entities]);

        const newUpdates = [];
        if (prevEntity.id > 0) {
            const update = addUncommittedFieldUpdate(prevEntity, 'seqPosition', pos + 1);
            if (update) {
                newUpdates.push(update);
            }
        }
        if (nextEntity.id > 0) {
            const update = addUncommittedFieldUpdate(nextEntity, 'seqPosition', pos);
            if (update) {
                newUpdates.push(update);
            }
        }
        setEntityUpdates([...entityUpdates, ...newUpdates]);
    }

    function addUncommittedFieldUpdate(entity, field, value) {
        let entityUpdate = entityUpdates.find(e => e.id === entity.id);
        if (entityUpdate) {
            entityUpdate[field] = value;
        } else {
            entityUpdate = {id: entity.id};
            if (baseUpdater) {
                entityUpdate = {
                    ...entityUpdate,
                    ...baseUpdater(entity)
                }
            }
            entityUpdate[field] = value;
            return entityUpdate;
        }
    }

    function addFieldUpdate(id, field, value) {
        let entityUpdate = entityUpdates.find(e => e.id === id);
        if (entityUpdate) {
            entityUpdate[field] = value;
            setEntityUpdates([...entityUpdates]);
        } else {
            const entity = entities.find(e => e.id === id);
            if (!entity) return;

            entityUpdate = {id: id};
            if (baseUpdater) {
                entityUpdate = {
                    ...entityUpdate,
                    ...baseUpdater(entity)
                }
            }
            entityUpdate[field] = value;
            setEntityUpdates([...entityUpdates, entityUpdate]);
        }
    }

    return [
        entityUpdates,
        addEntity,
        deleteEntity,
        updateField,
        syncChanges,
        moveUp,
        moveDown
    ];
};
