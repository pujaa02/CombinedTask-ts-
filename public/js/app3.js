let leftarr=document.getElementById("left-arr");
let rightarr=document.getElementById("right-arr");
var index=1;
showSlider(index);

function Slider(n){
   showSlider(index +=n);
}

function showSlider(n){
    var rows=document.getElementsByClassName("row8");
       if(n>rows.length){
            // index=1; 
            return;  
        }
        if(n<1){
         //   index=rows.length;
         return;
        }
    for(var i=0; i<rows.length; i++){
        rows[i].style.display="none";
     }
       rows[index-1].style.display="flex"
}


