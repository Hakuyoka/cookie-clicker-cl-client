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
            await client.close();
            process.exit();
        } else if(command === randCodeGen.code) {
            await client.clickGolden();
        } else if(command === "available") {
           let  productions = await client.availableProduction();
            productions.forEach((product)=>{
                console.log(product.name, ":",product.price);
            });
        } else if(command.startsWith("buy")) {
            let name = command.replace("buy", "").trim();
            console.log(name);
            await client.purchase(name);
        }
    }
}

module.exports = CommandExcuter;