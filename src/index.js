import { init, displayText, toggleNeoNumber, changeMode, modes } from "./pad";
import express from "express";
import http from "http";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const router = express.Router();
const jsonParser = bodyParser.json();
const server = http.createServer(app);

app.use("/", router);

router.post("/character", jsonParser, (req, res) => {
    // { "string": string }
    // colors mostly for other apps/scripts sending out the data to launchpad
    if (req.body.color) {
        displayText(req.body.string, req.body.color);
    } else {
        displayText(req.body.string);
    }
    res.send("Displaying your string");
});

router.post("/mode", jsonParser, (req, res) => {
    console.log(req.body);
    if (req.body.mode && modes.includes(req.body.mode.toLowerCase())) {
        changeMode(req.body.mode.toLowerCase());
        res.send("Changed mode to " + req.body.mode);
    }
});

router.get("/clock", (req, res) => {
    toggleNeoNumber();
    res.send("Toggling clock font");
});

app.get("/", (req, res) => {
    // hello world
    res.send("Hello World!");
});

server.listen(3005, () => {
    console.log("listening on *:3005");
});

init();
