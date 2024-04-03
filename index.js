var express = require("express");
var app = express();
const main = require("./routes/router");
const singletask = require("./controller/singletask");
const orderby = require("./controller/orderby");
const attendance = require("./controller/attendance");
const result = require("./controller/result");
const fetchusingquery = require("./controller/fetchusingquery");
const dynamicgrid = require("./controller/dynamicgrid");
const delimeter = require("./controller/delimeter");
const generateform = require("./controller/generateform");
const simpleform = require("./controller/simpleform");
const ajaxform = require("./controller/ajaxform");
const fetchcity = require("./controller/fetchcity");
const timestamp = require("./controller/timestamp");
const frame = require("./controller/frame");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/img_videos"));

let port = process.env.PORT || 5065;

app.listen(port, (err) => {
  if (err) {
    console.log(
      `Error: other server is running in  ${port} ,change the port number`
    );
  } else {
    console.log(`Server is running in port: ${port} `);
    app.use(main);
    app.use(singletask);
    app.use(orderby);
    app.use(attendance);
    app.use(result);
    app.use(fetchusingquery);
    app.use(dynamicgrid);
    app.use(delimeter);
    app.use(generateform);
    app.use(simpleform);
    app.use(ajaxform);
    app.use(fetchcity);
    app.use(timestamp);
    app.use(frame);
  }
});
