import {useContext, useEffect, useRef, useState} from 'react';
import Editor from "@monaco-editor/react";
import {AppContext} from "../../context/AppContext";
import ImageBar from "./ImageBar";
import {API_URL, Folder} from "../../api/config";

const defaultEditorValue = '<!-- Place your <body> markup here (do not specify <html>, <head>, etc.).\n\t' +
    ' Click on code icon next to the image title in the list to insert\n\t' +
    ' appropriate <img>. Please note, if you\'ll try to load file with\n\t' +
    ' name that already exists in the system, it will be suffixed\n\t' +
    ' by index (-1, -2, etc.) -->\n';

const SectionEditor = () => {
    const appContext = useContext(AppContext);

    const id = useRef(null);
    const modalRef = useRef(null);
    const editorRef = useRef(null);

    const [enablePreview, setEnablePreview] = useState(false);
    const [title, setTitle] = useState();
    const [markup, setMarkup] = useState(defaultEditorValue);
    const [previewMarkup, setPreviewMarkup] = useState(defaultEditorValue);

    useEffect(() => setPreviewMarkup(markup.replaceAll('__SERVER__', API_URL)), [markup]);

    useEffect(() => {
        (modalRef.current: HTMLDivElement).addEventListener('show.bs.modal', onShowModal);
        return () => (modalRef.current: HTMLDivElement)?.removeEventListener('show.bs.modal', onShowModal)
    }, [onShowModal]);

    function onShowModal(e) {
        const sectionId = Number(e.relatedTarget.getAttribute('data-bs-sec-id'));
        id.current = sectionId;
        const sectionTitle = e.relatedTarget.getAttribute('data-bs-sec-title');
        setTitle(sectionTitle);
        appContext.getCustomMarkup(sectionId).then(r => setMarkup(r || defaultEditorValue));
    }

    function putImgTag(imgName) {
        const editor = (editorRef.current: monaco.editor.ICodeEditor);
        const pos: monaco.Position = editor.getPosition();
        const imgTag = `<img src='__SERVER__/img/${Folder.CUSTOM_PAGE_IMG}/${imgName}' class='w-100' alt='image'/>`;

        const range: monaco.IRange = {
            startColumn: pos.column,
            startLineNumber: pos.lineNumber,
            endColumn: pos.column,
            endLineNumber: pos.lineNumber
        };
        const insertOp: monaco.editor.IIdentifiedSingleEditOperation = {
            forceMoveMarkers: true,
            range: range,
            text: imgTag
        };
        editor.executeEdits("section-editor", [insertOp]);
        editor.focus();
    }

    function resetModal() {
        setEnablePreview(false);
        setTitle(null);
        setMarkup(defaultEditorValue);
    }

    return (
        <div ref={modalRef} id="section-editor-modal" className="modal fade" role="dialog" tabIndex="-1">
            <div className="modal-dialog modal-fullscreen" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">
                            <i className='fas fa-pencil-ruler fs-5'/>
                            &nbsp;Edit custom section {title && `(${title})`}
                        </h4>
                        <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"/>
                    </div>
                    <div className="modal-body">
                        {enablePreview
                            ? <div className="container mb-5">
                                <div className="row">
                                    <div className='col' dangerouslySetInnerHTML={{__html: previewMarkup}}/>
                                </div>
                            </div>
                            : <div className="container-fluid h-100">
                                <div className="row h-100">
                                    <div className="col-md-9 col-lg-9 col-xl-9 col-xxl-9">
                                        <Editor defaultLanguage="html"
                                                value={markup}
                                                onChange={(value) => setMarkup(value)}
                                                onMount={(editor) => editorRef.current = editor}/>
                                    </div>
                                    <div className="col-md-3 col-lg-3 col-xl-3 col-xxl-3 h-100
                                                    mobile-invisible-col flex-column">
                                        <ImageBar putImgTag={putImgTag}/>
                                    </div>
                                </div>
                            </div>}
                    </div>
                    <div className="modal-footer justify-content-between">
                        <div>
                            <button className="btn btn-primary mobile-invisible-btn" type="button"
                                    onClick={() => setEnablePreview(!enablePreview)}>
                                {enablePreview
                                    ? <><i className="fas fa-code"/>&nbsp;Back to code</>
                                    : <><i className="fas fa-play"/>&nbsp;Preview section</>
                                }
                            </button>
                        </div>
                        <div>
                            <button className="btn btn-light me-2" type="button" data-bs-dismiss="modal"
                                    onClick={resetModal}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" type="button" data-bs-dismiss="modal"
                                    onClick={() => {
                                        if (id.current) {
                                            appContext.updateField(id.current, 'customMarkup', markup);
                                        } else {
                                            appContext.addSection(markup);
                                        }
                                        resetModal();
                                    }}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionEditor;