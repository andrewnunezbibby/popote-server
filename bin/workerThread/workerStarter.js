const path = require("path");

const {
  Worker,
  isMainThread,
  workerData,
  MessageChannel,
} = require("worker_threads");
// var dayInMilliseconds = 1000 * 60 * 60 * 24;
// var dayInMilliseconds = 10000;

var runWorker = () => {
  const worker = new Worker(path.join(__dirname, "dbCacheWorker.js"), {
    workerData,
  });
  const { port1, port2 } = new MessageChannel();
  port1.on("message", (message) => {
    console.log("message from worker:", message);
  });
  worker.postMessage({ port: port2 }, [port2]);
};

// var workerInterval = setInterval(runWorker, dayInMilliseconds);

// module.exports = workerInterval;
