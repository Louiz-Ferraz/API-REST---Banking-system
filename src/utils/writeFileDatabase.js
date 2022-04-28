const fs = require('fs/promises');

const writeFileDatabase = async (databaseFilePath, databaseString) => {
    try {
        await fs.writeFile(databaseFilePath, 'module.exports = {');
        await fs.appendFile(databaseFilePath, databaseString);
        await fs.appendFile(databaseFilePath, '}');
        return;
    } catch (error) {
        return error;
    }
}

module.exports = writeFileDatabase;