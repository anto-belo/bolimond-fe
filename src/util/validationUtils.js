export const checkNullFields = (object, fields, allRequired) => {
    for (const field in fields) {
        if ((allRequired && !object[field]) || (object[field] && object[field] === '')) {
            return false;
        }
    }
    return true;
}
