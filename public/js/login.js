let arr = ["user", "pass"];
function validateForm() {
  for (let i = 0; i < arr.length; i++) {
    if (
      document.getElementById(arr[i]).value == "" ||
      document.getElementById(arr[i]).value == null
    ) {
      document.getElementById("demo").innerHTML = `fields can't be empty!!`;

      return false;
    }
  }
  return true;
}
let user = document.getElementById("user");
let pass = document.getElementById("pass");
let frgt = document.getElementById("frgt");
let loginbtn = document.getElementById("login");
loginbtn.addEventListener("click", async () => {
  const check = validateForm();
  if (check) {
    var response;
    console.log("if");
    response = await fetch("/loginpage", {
      method: "post",
      body: new URLSearchParams(new FormData(document.getElementById("form"))),
    });
    console.log(response);
    var result2 = await response.json();
    console.log("response", result2);
    console.log(result2.flag);

    if (result2.flag == true) {
      console.log("true res2");
      document.cookie = `token=${result2.token}`;
      window.location.href = `/completelogin`;
    } else {
      document.getElementById("demo").innerHTML = `invalid Data!!`;
    }
  }
});
//==============ok==============
frgt.addEventListener("click", async () => {
  console.log("clicked");
  let mail = document.getElementById("user").value;
  console.log(mail);
  if (mail == "" || mail == null) {
    console.log("enter");
    document.getElementById("demo").innerHTML = `Please Enter Email!!`;
  } else {
    let fetchdate = await fetch(`/redirect/${mail}`);
    const result = await fetchdate.json();
    console.log("result", result);
    if (result == "email not valid") {
      document.getElementById(
        "demo"
      ).innerHTML = `Please Enter correct Email!!`;
    } else {
      window.location.href = `/secondpage/${mail}`;
    }
  }
});
let date = new Date(Date.now() + 1000 * 60 * 1).toLocaleString(undefined, {
  timeZone: "Asia/Kolkata",
});
console.log(date);
