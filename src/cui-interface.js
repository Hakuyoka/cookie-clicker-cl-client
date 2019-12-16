const rl= require("readline").createInterface(process.stdin,process.stdout);
const Executer = require("./CommandExcuter");
let executer = new Executer();
(async function(){
    while(true) {
        let input = await new Promise(res=>rl.once("line",res));
        executer.exec(input).then(()=>{});
    }
})();