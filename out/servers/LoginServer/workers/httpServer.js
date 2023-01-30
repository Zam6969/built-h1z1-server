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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const worker_threads_1 = require("worker_threads");
const http_1 = __importDefault(require("http"));
const enums_1 = require("../../../utils/enums");
const constants_1 = require("../../../utils/constants");
function sendMessageToServer(type, requestId, data) {
    const message = {
        type: type,
        requestId: requestId,
        data: data,
    };
    worker_threads_1.parentPort?.postMessage(message);
}
const { MONGO_URL, SERVER_PORT } = worker_threads_1.workerData;
const client = new mongodb_1.MongoClient(MONGO_URL, {
    maxPoolSize: 5,
});
const dbName = constants_1.DB_NAME;
const db = client.db(dbName);
client.connect();
let requestCount = 0;
const pendingRequest = {};
function parseQueryString(queryString) {
    const queryObject = {};
    const elementArray = queryString.split("&");
    elementArray.forEach((element) => {
        const [key, value] = element.split("=");
        queryObject[key] = value;
    });
    return queryObject;
}
const agent = new http_1.default.Agent({
    keepAlive: true,
    maxSockets: 45,
});
http_1.default.request({
    agent: agent,
    method: "GET",
    hostname: "localhost",
    port: SERVER_PORT,
});
const httpServer = http_1.default.createServer().listen(SERVER_PORT);
httpServer.on("request", async function (req, res) {
    const url = req.url ? req.url.substr(1, req.url.length - 1) : "";
    const [path, queryString] = url.split("?");
    const queryObject = queryString ? parseQueryString(queryString) : null;
    switch (path) {
        case "servers": {
            const collection = db.collection(enums_1.DB_COLLECTIONS.SERVERS);
            const serversArray = await collection.find().toArray();
            res.writeHead(200, { "Content-Type": "text/json" });
            res.write(JSON.stringify(serversArray));
            res.end();
            break;
        }
        case "ping": {
            requestCount++;
            sendMessageToServer("ping", requestCount, null);
            pendingRequest[requestCount] = res;
            break;
        }
        case "pingzone": {
            requestCount++;
            sendMessageToServer("pingzone", requestCount, Number(queryObject?.serverId));
            pendingRequest[requestCount] = res;
            break;
        }
        default:
            res.writeHead(404, { "Content-Type": "text/json" });
            res.end();
            break;
    }
});
httpServer.on("error", (error) => {
    console.error(error);
});
worker_threads_1.parentPort?.on(`message`, (message) => {
    const { type, requestId, data } = message;
    switch (type) {
        case "pingzone": {
            const res = pendingRequest[requestId];
            if (data === "pong") {
                res.writeHead(200, { "Content-Type": "text/json" });
                res.write(data);
            }
            else {
                res.writeHead(404, { "Content-Type": "text/json" });
            }
            res.end();
            delete pendingRequest[requestId];
            break;
        }
        case "ping":
            const res = pendingRequest[requestId];
            res.writeHead(200, { "Content-Type": "text/json" });
            res.write(data);
            res.end();
            delete pendingRequest[requestId];
            break;
        default:
            break;
    }
});
//# sourceMappingURL=httpServer.js.map