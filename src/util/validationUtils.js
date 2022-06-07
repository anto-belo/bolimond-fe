export const checkBlankStringFields = (object, fields, allRequired) => {
    return fields.every(field => {
        if (allRequired) {
            return object[field]?.trim() !== '';
        }
        if (object[field] === '') object[field] = ' ';
        if (object[field]) {
            return object[field].trim() !== '';
        }
        return true;
    });
}

export const checkUniqueByField = (objects, field) => {
    const fieldValues = objects
        .map(o => o[field])
        .filter(field => field);
    return fieldValues.length === new Set(fieldValues).size;
}
