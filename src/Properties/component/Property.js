import React from 'react';
import '../config/selectPropertyValues';
import SelectPropertyValue from "./SelectPropertyValue";
import {selectPropertyValues} from "../config/selectPropertyValues";

const Property = ({id, title, value, valueType, setField, custom, tooltip, onDelete}) => {
    const valueInputType = valueType === 'STRING' ? "text" : "number";
    const valuesSet = selectPropertyValues.get(id);

    return (
        <tr>
            <td>
                <div className="d-flex justify-content-between align-items-center">
                    {!custom
                        ? <>
                            <div
                                className="d-flex justify-content-between align-items-center justify-content-sm-start w-100">
                                <p className="my-1">{title}</p>
                                {tooltip &&
                                    <i className="fas fa-question-circle text-black-50 ms-1"
                                       data-bs-toggle="tooltip" data-bss-tooltip="" title={tooltip}/>
                                }
                            </div>
                            <i className="fas fa-lock text-black-50 ms-3 cursor-pointer"
                               data-bs-toggle="tooltip" data-bss-tooltip=""
                               title="This property cannot be deleted."/>
                        </>
                        : <>
                            <input className="flex-grow-1" type="text" value={title}
                                   onChange={(e) => setField(id, "title", e.target.value)}/>
                            <i className="fas fa-trash-alt ms-3 cursor-pointer delete-icon"
                               onClick={() => onDelete(id)}/>
                        </>
                    }
                </div>
            </td>
            <td>
                <div className="d-flex">
                    {valuesSet
                        ? <SelectPropertyValue values={valuesSet} selected={value}
                                               onChange={(e) => setField(id, "value", e.target.value)}/>
                        : <input className="flex-grow-1" type={valueInputType} value={value} min='0'
                                 onChange={(e) => setField(id, "value", e.target.value)}/>
                    }
                </div>
            </td>
        </tr>
    );
};

export default Property;