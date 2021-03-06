import {useEffect, useRef} from 'react';

const ResponsiveButtonBar = ({onLoadMore, allLoaded, children}) => {
    const buttonBarRef = useRef();

    const loadMoreButtonClasses = allLoaded
        ? 'btn btn-outline-dark disabled'
        : 'btn btn-dark';

    useEffect(() => {
        const handleResize = () => {
            const horizontal = window.innerWidth > 576;
            const buttonBar: HTMLDivElement = buttonBarRef.current;
            buttonBar.classList.toggle("btn-group", horizontal);
            buttonBar.classList.toggle("btn-group-vertical", !horizontal);
            buttonBar.classList.toggle("flex-grow-1", !horizontal);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="btn-toolbar justify-content-sm-center justify-content-lg-end mt-3">
            <div ref={buttonBarRef} className="btn-group" role="group">
                <button className={loadMoreButtonClasses} type="button" onClick={onLoadMore}>
                    <i className="fas fa-spinner"/>&nbsp;Load more
                </button>
                {children}
            </div>
        </div>
    );
};

export default ResponsiveButtonBar;