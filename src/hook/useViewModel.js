import {useState} from 'react';

export const useViewModel = (entities, setEntities, entityTemplateFactory, baseUpdater) => {
    const [entityUpdates, setEntityUpdates] = useState([]);
    const [newEntities, setNewEntities] = useState([]);

    function addEntity(...args) {
        setNewEntities([...newEntities, {
            id: Math.round(-Math.random() * 100_000_000 + 1),
            ...entityTemplateFactory(...args)
        }]);
    }

    function moveUp(id) {
        const seqPos = (id > 0 ? entities : newEntities).find(e => e.id === id).seqPosition;
        if (seqPos === 1) return;
        swapBySeqPos(seqPos, seqPos - 1);
    }

    function moveDown(id) {
        const seqPos = (id > 0 ? entities : newEntities).find(e => e.id === id).seqPosition;
        if (seqPos === entities.length + newEntities.length) return;
        swapBySeqPos(seqPos, seqPos + 1);
    }

    function swapBySeqPos(sp1, sp2) {
        if (!sp1 || !sp2 || sp1 < 0 || sp2 < 0 || sp1 === sp2) return;
        const entity1 = [...entities, ...newEntities].find(e => e.seqPosition === sp1);
        const entity2 = [...entities, ...newEntities].find(e => e.seqPosition === sp2);
        changeField(entity1.id, "seqPosition", sp2);
        changeField(entity2.id, "seqPosition", sp1);
    }

    function deleteEntity(id) {
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

    function changeField(id, field, value) {
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

    return [
        newEntities,
        entityUpdates,
        addEntity,
        moveUp,
        moveDown,
        deleteEntity,
        changeField,
        applyChangeSet
    ];
};
