var express = require("express");
const { recordsLogic } = require("../logics");
var router = express.Router();

router.post("/", function (req, res, next) {
  recordsLogic
    .getRecords(req.body)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.error({ err }, "Error on post method");
      res.status(400).send(err.message);
    });
});

module.exports = router;
