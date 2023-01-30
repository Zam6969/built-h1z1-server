"use strict";
// ======================================================================
//
//   GNU GENERAL PUBLIC LICENSE
//   Version 3, 29 June 2007
//   copyright (C) 2020 - 2021 Quentin Gruber
//   copyright (C) 2021 - 2023 H1emu community
//
//   https://github.com/QuentinGruber/h1z1-server
//   https://www.npmjs.com/package/h1z1-server
//
//   Based on https://github.com/psemu/soe-network
// ======================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthThreadDecorator = void 0;
const worker_threads_1 = require("worker_threads");
const debug = require("debug")("HEALTHWORKER");
function healthThreadDecorator(target) {
    target.prototype._healthWorker = new worker_threads_1.Worker(`${__dirname}/healthWorker.js`, {
        workerData: { threadToWatchPid: process.pid },
    });
    if (!process.env.VSCODE_DEBUG) {
        target.prototype._healthWorker.on("message", () => {
            target.prototype._healthWorker.postMessage(true);
        });
    }
}
exports.healthThreadDecorator = healthThreadDecorator;
const healthTime = 10000;
function checkHealth() {
    const { threadToWatchPid } = worker_threads_1.workerData;
    let healthTimeoutTimer;
    const healthTimer = setTimeout(() => {
        worker_threads_1.parentPort?.postMessage(true);
        healthTimeoutTimer = setTimeout(() => {
            console.log("Health check failed");
            process.kill(threadToWatchPid);
        }, healthTime);
    }, healthTime);
    worker_threads_1.parentPort?.on("message", () => {
        healthTimer.refresh();
        clearTimeout(healthTimeoutTimer);
    });
}
if (worker_threads_1.workerData?.threadToWatchPid &&
    worker_threads_1.workerData.threadToWatchPid === process.pid &&
    !process.env.VSCODE_DEBUG) {
    debug("Health check started");
    checkHealth();
}
//# sourceMappingURL=healthWorker.js.map