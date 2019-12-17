const client = require("./clicker-client");
const randCodeGen = require("./RandomEventKeyGen");
(async ()=>{
    await client.start();

})();

class CommandExcuter {
    async exec(command) {
        if(command === "click" || command === ""|| command === "c") {
            await client.click();
        } else if(command === "exit"){
            process.exit;
        } else if(command === randCodeGen.code) {
            await client.clickGolden();
        }

    }
}

module.exports = CommandExcuter;