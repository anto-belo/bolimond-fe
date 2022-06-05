import {useState} from 'react';

/**
 * Kind of engine, which reacts on all user interactions with the page,
 * changes data model and creates appropriate changelist
 * @param entities initial dataset, part of useState() hook
 * @param setEntities dataset setter, part of useState() hook
 * @param newEntityFactory method, used for instantiating new entities
 * @param baseUpdater method, used to instantiate update DTO with
 * specific fields (optional, in case of absence, will be set id and
 * modified fields only)
 * @returns an array of next elements:
 * <ul>
 *     <li>entityUpdates - changelist</li>
 *     <li>addEntity - adds new entities. Pass parameters depending on
 *     newEntityFactory declaration</li>
 *     <li>deleteEntity - deletes entity by id</li>
 *     <li>updateField - updates view model, accepts entity id, field
 *     name and its new value</li>
 *     <li>syncChanges - replaces "new" entities with their copies with
 *     id set after saving in db, resets changelist</li>
 * </ul>
 *
 */
export const useViewModel = (entities, setEntities, newEntityFactory, baseUpdater) => {
    /**
     * Changelist. Contains changes of entities that come from a server
     * only
     */
    const [entityUpdates, setEntityUpdates] = useState([]);

    /**
     * Adds new entity. Until calling syncChanges() all new entities
     * have a random <b>negative</b> number as a temporal id
     * @param args parameters depending on newEntityFactory declaration
     */
    function addEntity(...args) {
        const newEntity = {
            id: Math.round(-Math.random() * 2_000_000_000 + 1),
            ...newEntityFactory(...args)
        };
        setEntities([...entities, newEntity]);
    }

    /**
     * Deletes entity
     * @param id entity to delete id
     */
    function deleteEntity(id) {
        const entity = entities.find(e => e.id === id);
        if (!entity) return;

        setEntities([...entities.filter(e => e.id !== id)]);
        if (id > 0) {
            addFieldUpdate(id, "delete", true);
        }
    }

    /**
     * Updates view model
     * @param id entity to update id
     * @param field field to update
     * @param value new value
     */
    function updateField(id, field, value) {
        if (field === 'seqPosition') {
            addSeqPositionUpdate(id, value);
            return;
        }

        const entity = entities.find(e => e.id === id);
        if (!entity) return;

        entity[field] = value;
        setEntities([...entities]);
        if (id > 0) {
            addFieldUpdate(id, field, value);
        }
    }

    /**
     * Replaces "new" entities with their copies with id set after
     * saving in db, resets changelist
     * @param savedEntities new entities copies with id set
     */
    function syncChanges(savedEntities) {
        setEntities([...entities.filter(e => e.id > 0), ...savedEntities]);
        setEntityUpdates([]);
    }

    /**
     * Adds a record to the entityUpdates list
     * @param id entity to update id
     * @param field field to update
     * @param value new value
     */
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

    /**
     * Specific version of updateField function for sequence position
     * property
     * @param id entity to update id
     * @param newPos the position before which to insert the entity
     */
    function addSeqPositionUpdate(id, newPos) {
        const entity = entities.find(e => e.id === id);

        if (!entity?.seqPosition || !newPos || entity.seqPosition + 1 === newPos
            || newPos <= 0 || newPos >= entities.length + 2) return;
        const curPos = entity.seqPosition;
        const newUpdates = [];

        entity.seqPosition = null;
        if (curPos < newPos) {
            for (let i = curPos + 1; i < newPos; i++) {
                const curEntity = entities.find(e => e.seqPosition === i);
                curEntity.seqPosition = i - 1;
                newUpdates.push(addUncommittedFieldUpdate(curEntity, 'seqPosition', i - 1));
            }
            entity.seqPosition = newPos - 1;
            newUpdates.push(addUncommittedFieldUpdate(entity, 'seqPosition', newPos - 1));
        } else {
            for (let i = curPos - 1; i > newPos - 1; i--) {
                const curEntity = entities.find(e => e.seqPosition === i);
                curEntity.seqPosition = i + 1;
                newUpdates.push(addUncommittedFieldUpdate(curEntity, 'seqPosition', i + 1));
            }
            entity.seqPosition = newPos;
            newUpdates.push(addUncommittedFieldUpdate(entity, 'seqPosition', newPos));
        }

        setEntities([...entities]);
        setEntityUpdates([...entityUpdates, ...newUpdates.filter(u => u)]);
    }

    /**
     * Specific version of addFieldUpdate, which does not use
     * useState()'s hook setters setEntities and setEntityUpdates,
     * but changes only entities and entityUpdates
     * @param entity entity to update
     * @param field field to update
     * @param value new value
     * @returns entity's update DTO in case it didn't exist before this
     * function call
     */
    function addUncommittedFieldUpdate(entity, field, value) {
        if (entity.id < 0) return;
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

    return [entityUpdates, addEntity, deleteEntity, updateField, syncChanges];
};
