//===========generate random string code ==========
function randomstr() {
  let length = 12;
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const total = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * total));
    counter += 1;
  }
  return result;
}
let str = randomstr();
var email = document.getElementById("email");
//===========validation==========
let j = 0;
let arr = ["fname", "lname", "email"];
function validateForm() {
  document.getElementsByClassName("error")[j].innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    if (
      document.getElementById(arr[i]).value == "" ||
      document.getElementById(arr[i]).value == null
    ) {
      document.getElementsByClassName("error")[
        i
      ].innerHTML = `This field is required`;
      j = i;
      return false;
    }
    if (arr[i] == "email") {
      ValidateEmail(document.getElementById(arr[i]).value);
      if (ValidateEmail(document.getElementById(arr[i]).value) != true) {
        return false;
      }
    }
  }
  return true;
}
function ValidateEmail(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  } else {
    text = "Please Enter Valid Email";
    document.getElementById("p5").innerHTML = text;
    return false;
  }
}
const sub = document.getElementById("submit");
sub.addEventListener("click", async () => {
  const check = validateForm();
  if (check) {
    console.log("checked");
    const checkdata = await fetch(`/getData?email=${email.value}`);
    const result = await checkdata.json();
    console.log(result.length);
    console.log(result);
    // let flag = true;
    if (result.length > 0) {
      console.log("match");
      console.log("if fire");
      document.getElementById("demo").innerHTML = "Email already Exists!!";
      // flag = false;
    } else {
      var response;
      response = await fetch(`/register/${str}`, {
        method: "POST",
        body: new URLSearchParams(
          new FormData(document.getElementById("form"))
        ),
      });
      console.log(response);
      const result = await response.json();
      console.log(result);
      window.location.href = `http://localhost:5065/afterregister/${str}`;
    }
  }
});
