const route = require("express").Router();

const singletask = require("../controller/singletask");
const orderby = require("../controller/orderby");
const attendance = require("../controller/attendance");
const result = require("../controller/result");
const fetchusingquery = require("../controller/fetchusingquery");
const dynamicgrid = require("../controller/dynamicgrid");
const delimeter = require("../controller/delimeter");
const generateform = require("../controller/generateform");
const simpleform = require("../controller/simpleform");
const ajaxform = require("../controller/ajaxform");
const fetchcity = require("../controller/fetchcity");
const timestamp = require("../controller/timestamp");
const frame = require("../controller/frame");
const login = require("../controller/login");

route.use(singletask);
route.use(orderby);
route.use(attendance);
route.use(result);
route.use(fetchusingquery);
route.use(dynamicgrid);
route.use(delimeter);
route.use(generateform);
route.use(simpleform);
route.use(ajaxform);
route.use(fetchcity);
route.use(timestamp);
route.use(frame);
route.use(login);

module.exports = route;
