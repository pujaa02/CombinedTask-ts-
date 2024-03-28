var express = require("express");
var app = express();
process.env.PORT;
const router = express.Router();
const all = require("./router");
const dotenv = require("dotenv");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/img_videos"));

let port = process.env.PORT || 5059;

app.listen(port, (err) => {
  if (err) {
    console.log(
      `Error: other server is running in  ${port} ,change the port number`
    );
  } else {
    console.log(`Server is running in port: ${port} `);
    app.use(all);
  }
});
