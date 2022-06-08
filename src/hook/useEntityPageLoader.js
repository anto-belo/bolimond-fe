import {useEffect, useState} from "react";

export const useEntityPageLoader = (pageGetter, pageSize, entities, setEntities, updateInitialPositions, mapper) => {
    const [allLoaded, setAllLoaded] = useState(false);
    const [lastLoadedPage, setLastLoadedPage] = useState(0);

    useEffect(() => {
        pageGetter(lastLoadedPage, pageSize)
            .then(r => {
                const dbEntities = r.data;
                setAllLoaded(dbEntities.length < pageSize);
                if (updateInitialPositions && dbEntities.length > 0 && dbEntities[0].seqPosition) {
                    const changeSet = [];
                    let nextIndex = entities.length + 1;
                    for (let i = 0; i < dbEntities.length; i++) {
                        if (dbEntities[i].seqPosition !== nextIndex) {
                            dbEntities[i].seqPosition = nextIndex;
                            changeSet.push({
                                id: dbEntities[i].id,
                                seqPosition: nextIndex
                            });
                        }
                        nextIndex++;
                    }
                    updateInitialPositions(changeSet);
                }
                setEntities([...entities, ...(mapper ? dbEntities.map(e => mapper(e)) : dbEntities)]);
            })
            .catch(e => alert(e.message));
    }, [lastLoadedPage]);

    function onLoadMore() {
        setLastLoadedPage(lastLoadedPage + 1);
    }

    return [allLoaded, onLoadMore];
};
