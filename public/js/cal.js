let buttons = document.querySelectorAll(".btn");
let input = document.querySelector("#input");
let string = "";

Array.from(buttons).forEach((btn) => {
  btn.addEventListener("click", (e) => {
    if (e.target.innerHTML == "=") {
      string = eval(string);
      console.log(string);
      input.value = string;
    } else if (e.target.innerHTML == "C") {
      string = "";
      input.value = string;
    } else {
      console.log(e.target);
      string = string + e.target.innerHTML;
      console.log(string);
      input.value = string;
    }
  });
});
