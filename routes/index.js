import express from 'express';
let router = express.Router();
/**
 * home page
 */
router.get('/', function (req, res) {
    res.sendfile("index.html");
});

module.exports = router;
