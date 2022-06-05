import React, {useContext, useEffect, useRef, useState} from 'react';
import Editor from "@monaco-editor/react";
import {AppContext} from "../../../context/AppContext";

const defaultEditorValue = '<!-- Place your <body> markup here (do not specify <html>, <head>, etc.). \n\t' +
    'Double click on image title in the list to insert appropriate <img> -->\n';

const SectionEditor = () => {
    const appContext = useContext(AppContext);

    const id = useRef(null);
    const modalRef = useRef(null);
    const editorRef = useRef(null);

    const [title, setTitle] = useState();
    const [markup, setMarkup] = useState(defaultEditorValue);

    function onShowModal(e) {
        const sectionId = Number(e.relatedTarget.getAttribute('data-bs-sec-id'));
        id.current = sectionId;
        const sectionTitle = e.relatedTarget.getAttribute('data-bs-sec-title');
        setTitle(sectionTitle);
        appContext.getCustomMarkup(sectionId).then(r => setMarkup(r || defaultEditorValue));
    }

    useEffect(() => {
        (modalRef.current: HTMLDivElement).addEventListener('show.bs.modal', onShowModal);
        return () => (modalRef.current: HTMLDivElement).removeEventListener('show.bs.modal', onShowModal)
    }, [onShowModal]);

    return (
        <div ref={modalRef} id="section-editor-modal" className="modal fade" role="dialog" tabIndex="-1">
            <div className="modal-dialog modal-fullscreen" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">
                            <i className='fas fa-pencil-ruler fs-5'/>
                            &nbsp;Edit custom section {title && `(${title})`}
                        </h4>
                        <button className="btn-close" type="button" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid h-100">
                            <div className="row h-100">
                                <div className="col-md-3 col-lg-3 col-xl-2 col-xxl-2">

                                </div>
                                <div className="col-md-9 col-lg-9 col-xl-10 col-xxl-10">
                                    <Editor defaultLanguage="html"
                                            value={markup}
                                            onChange={(value) => setMarkup(value)}
                                            onMount={(editor) => editorRef.current = editor}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-light" type="button" data-bs-dismiss="modal">Cancel</button>
                        <button className="btn btn-primary" type="button" data-bs-dismiss="modal"
                                onClick={() => {
                                    if (id.current) {
                                        appContext.updateField(id.current, 'customMarkup', markup);
                                    } else {
                                        appContext.addSection(markup);
                                    }
                                    setTitle(null);
                                    setMarkup(defaultEditorValue);
                                }}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionEditor;