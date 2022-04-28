const undefinedOrBlankValidator = (itemToBeValidated) => {
    if (itemToBeValidated === undefined || itemToBeValidated === null) {
        return false;
    }
    if (typeof itemToBeValidated === "string") {
        if (itemToBeValidated.trim() === "") {
            return false;
        }
    }
    return true;
}

module.exports = undefinedOrBlankValidator;