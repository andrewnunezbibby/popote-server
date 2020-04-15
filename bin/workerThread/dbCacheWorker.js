const { parentPort, MessagePort } = require("worker_threads");
const fs = require("fs");

parentPort.on("message", (data) => {
  const { port } = data;
  // fs.writeFile("./vexOh", '', function () {
  //   console.log("done");
  // });
  //   var files = fs.readdirSync("./bin/apiResponseGroups");
  //   fs.open(`./bin/apiResponseGroups/${files[0]}`);
  //   console.log();
  //   console.log(Date.now());
  // var files = fs.readdirSync('C:/tmp').filter(fn => fn.endsWith('.csv'));

  port.postMessage("vexohDON!");
});
