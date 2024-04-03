async function get() {
  const checkdata = await fetch(`/checktime/<%=actcode%>`);
  const result = await checkdata.json();
  // console.log(result.length);
  console.log(result);
  if (result == "0") {
    document
      .getElementById("activate")
      .setAttribute("href", `/create_password/<%=actcode%>`);
  } else if (result == "1") {
    document.getElementById("error").innerHTML = "Link has been Expired!!";
    document
      .getElementById("activate")
      .setAttribute("href", `javascript:void(0)`);
  } else if (result == "2") {
    document.getElementById("error").innerHTML = "user not Found!!";
    document
      .getElementById("activate")
      .setAttribute("href", `javascript:void(0)`);
  }
}
