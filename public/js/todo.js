let input = document.querySelector(".input");
let button = document.getElementById("btn");
let ul = document.querySelector(".ul");
let string = "";
let count = 0;

button.addEventListener("click", (e) => {
  console.log("button was clicked");
  if (input.value == "") {
    alert("Please first write something!! ");
  } else {
    count++;
    string = input.value;
    let li = document.createElement("li");
    li.setAttribute("class", count);
    // console.log("id of "+count)
    let span = document.createElement("span");
    let button = document.createElement("button");
    button.setAttribute("class", "delbtn");
    li.innerHTML = string;
    button.innerHTML = "X";
    span.appendChild(button);
    li.appendChild(span);
    ul.appendChild(li);

    input.value = "";

    let allbtn = document.querySelectorAll(".delbtn");
    allbtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        var x = btn.parentElement.nodeName;

        var y = btn.parentNode;
        var z = y.parentNode;
        console.log(z);
        z.remove();
      });
    });
  }
});
