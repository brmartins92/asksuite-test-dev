const express = require('express');
const router = express.Router();
const BrowserService  = require("../services/BrowserService");
const getRoomsController  = require("../controller/RunGellAllRoomController");

router.get('/', (req, res) => {
    res.send('Hello Asksuite World!');
});

router.post('/search', getRoomsController.getRooms);

module.exports = router;
