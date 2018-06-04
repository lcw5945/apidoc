import express from "express";
import mockApi from "../../controls/mock";
import { cors } from "../../middleware";

let router = express.Router();

router.all("*", cors, mockApi.connecter);

router.use(function timeLog(req, res, next) {
  console.log("invok time", Date.now());
  next();
});

export default router;
