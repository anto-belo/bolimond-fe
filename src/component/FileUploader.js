import {useRef} from 'react';

const FileUploader = ({accept, multiple, maxSize, btnStyle, btnIcon, btnText, resetAfter, onUpload}) => {
    const inputFileRef = useRef();

    function onChangeHandler(files) {
        if (!files) return;

        files = [...files];
        let totalFilesSize = 0;
        for (let i = 0; i < files.length; i++) {
            totalFilesSize += files[i].size;
        }
        if (totalFilesSize > maxSize) {
            const sizeInMb = Math.round(totalFilesSize / 1024 / 1024);
            const maxInMb = Math.round(maxSize / 1024 / 1024);
            alert(`Files bundle size ${sizeInMb}MB, but can have ${maxInMb}MB max`);
            return;
        }

        onUpload(files);
        if (!resetAfter) return;
        inputFileRef.current.value = '';
    }

    return (<>
        <button className={`btn ${btnStyle || 'btn-success'}`} type="button"
                onClick={() => (inputFileRef.current: HTMLInputElement).click()}>
            {btnIcon && <><i className={btnIcon}/>&nbsp;</>}
            {btnText || 'Add image'}
        </button>
        <input ref={inputFileRef} type="file" style={{display: 'none'}} accept={accept} multiple={multiple}
               onChange={(e) => onChangeHandler(e.target.files)}/>
    </>);
};

export default FileUploader;