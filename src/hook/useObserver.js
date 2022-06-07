import {useEffect, useRef} from "react";

export const useObserver = ({ref, entities, allLoaded, onLoadMore}) => {
    const observerRef = useRef(null);

    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !allLoaded) {
                onLoadMore();
            }
        });
        if (ref && ref.current) {
            observerRef.current.observe(ref.current);
            console.log(ref.current)
        }
    }, [entities]);
}
