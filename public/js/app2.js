let previouscontent='wordpress-content';

function myfun(id){
    document.getElementById(previouscontent).style.display="none";
    document.getElementById(id).style.display="block";
    previouscontent=id;
}


let leftscroller=document.getElementById("left-arrow");

let rightscroller=document.getElementById("right-arrow");


var slider=document.getElementById("slider");
rightscroller.addEventListener("click",function(){
  slider.scrollBy(200,0)
})
leftscroller.addEventListener("click",function(){
  slider.scrollBy(-200,0)
})



