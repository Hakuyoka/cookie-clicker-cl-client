const client = require("./clicker-client");

(async ()=>{
    await client.start();

})();

class CommandExcuter {
    async exec(command) {
        if(command === "click" || command === ""|| command === "c") {
            await client.click();
        } else if(command === "exit"){
            process.exit;
        } else if(command === "aaaa") {
            await client.clickGolden();
        }

    }
}

module.exports = CommandExcuter;