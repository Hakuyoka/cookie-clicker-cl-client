const fs = require("fs");
const DefaultFilePath = "resource/save";

class SaveData {
    load() {
        try {
            fs.statSync(DefaultFilePath);
        } catch (e) {
            return null
        }
        return fs.readFileSync(DefaultFilePath, "utf-8")
    }

    save(hash) {
        fs.writeFileSync(DefaultFilePath, hash)
    }
}

module.exports = SaveData;