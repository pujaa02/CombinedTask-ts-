var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
const main = require("./routes/router");

app.use(cookieParser());
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
  }
});
