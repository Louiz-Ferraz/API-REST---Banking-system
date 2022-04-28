const passwordValidator = (typedPassword, correctPassword) => {
    if (typedPassword === correctPassword) {
        return true;
    }
    return false;
}

module.exports = passwordValidator;