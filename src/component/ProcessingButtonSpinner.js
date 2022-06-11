const ProcessingButtonSpinner = ({text, processing}) => {
    return (
        processing
            ? <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="visually-hidden">Loading...</span>
            </>
            : <span>{text}</span>
    );
};

export default ProcessingButtonSpinner;