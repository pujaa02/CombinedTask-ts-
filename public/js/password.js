let j = 0;
let arr = ["pass", "repass"];
function validateForm() {
  document.getElementsByClassName("error")[j].innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    // console.log(i);
    // console.log(arr[i]);
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
  }
  if (
    document.getElementById(arr[0]).value !=
    document.getElementById(arr[1]).value
  ) {
    console.log(
      "false value is ",
      document.getElementById(arr[0]).value,
      document.getElementById(arr[1]).value
    );
    document.getElementsByClassName(
      "error"
    )[1].innerHTML = `The reenter password is must same as password!!`;
    return false;
  }
  return true;
}
const set = document.getElementById("set");
let lt = window.location.href;
console.log(lt);
set.addEventListener("click", async () => {
  const check = validateForm();
  console.log(lt.split("/")[3]);
  if (check) {
    if (lt.substring(22).startsWith("secondpage")) {
      let mail = lt.split("/")[4];
      console.log("mail", mail);
      var response;
      response = await fetch(`/updatepass/${mail}`, {
        method: "POST",
        body: new URLSearchParams(
          new FormData(document.getElementById("form"))
        ),
      });
      console.log(response);
      var result2 = await response.json();
      console.log(result2);
      window.location.href = `http://localhost:5065/login`;
    } else {
      let code = lt.split("/")[4];
      console.log("code", code);
      var response;
      response = await fetch(`/successreg/${code}`, {
        method: "POST",
        body: new URLSearchParams(
          new FormData(document.getElementById("form"))
        ),
      });
      console.log(response);
      var result2 = await response.json();
      console.log(result2);
      window.location.href = `http://localhost:5065/login`;
    }
  }
});
