import {useEffect, useState} from "react";

export const useEntityPageLoader = (pageGetter, pageSize, entities, setEntities) => {
    const [allLoaded, setAllLoaded] = useState(false);
    const [lastLoadedPage, setLastLoadedPage] = useState(0);

    useEffect(() => {
        pageGetter(lastLoadedPage, pageSize)
            .then(r => {
                setAllLoaded(r.data.length < pageSize);
                setEntities([...entities, ...r.data]);
            })
            .catch(e => alert(e.message));
    }, [lastLoadedPage]);

    function onLoadMore() {
        setLastLoadedPage(lastLoadedPage + 1);
    }

    return [allLoaded, onLoadMore];
};
