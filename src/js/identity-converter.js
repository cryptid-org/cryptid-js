function isObject(element) {
    return element != null
        && typeof element == 'object'
        && !Array.isArray(element);
};

function convertToSortedForm(element) {
    if (Array.isArray(element)) {
        return element.map(convertToSortedForm);
    } else if (isObject(element)) {
        const sortedKeys = Object.keys(element).slice().sort();

        return sortedKeys.reduce((obj, key) => {
            obj[key] = convertToSortedForm(element[key]);

            return obj;
        }, Object.create(null));
    } else {
        return element;
    }
};

module.exports = function identityConverter(identity) {
    const sortedObj = convertToSortedForm(identity);

    return JSON.stringify(sortedObj);
};
