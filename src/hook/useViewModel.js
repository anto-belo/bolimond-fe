import {useEffect, useState} from 'react';

export const useViewModel = (entities, setEntities, entityTemplateFactory, baseUpdater) => {
    const [entityUpdates, setEntityUpdates] = useState([]);

    useEffect(() => console.log(entityUpdates), [entityUpdates]);

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

    function resetUpdates() {
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

        const prevEntityId = entities.find(e => e.seqPosition === pos).id;
        const nextEntityId = entities.find(e => e.seqPosition === pos + 1).id;
        updateField(prevEntityId, "seqPosition", pos + 1);
        updateField(nextEntityId, "seqPosition", pos);
    }

    function addFieldUpdate(id, field, value) {
        console.log(`adding update: ${id} ${field} ${value}`)
        let entityUpdate = entityUpdates.find(e => e.id === id);
        if (entityUpdate) {
            entityUpdate[field] = value;
            setEntityUpdates([...entityUpdates]);
        } else {
            const entity = entities.find(e => e.id === id);
            if (!entity) return;

            entityUpdate = {id: id};
            if (baseUpdater) {
                baseUpdater(entity);
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
        resetUpdates,
        moveUp,
        moveDown
    ];
};
