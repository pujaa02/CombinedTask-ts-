let boxes=document.querySelectorAll(".box");
let newbtn=document.querySelector("#new-btn");
let resetbtn=document.querySelector("#reset-btn");
let msgContainer=document.querySelector(".msg-container");
let msg=document.querySelector(".msg");

var player1=true;
var count=0;

var winPatterns=[
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

boxes.forEach((box)=>{
    box.addEventListener("click",()=>{
        if(player1){
            box.innerHTML="O";
            player1=false;
        }
        else{
            box.innerHTML="X";
            player1=true;
        }
        box.disabled=true;
        count++;
        let iswin=checkwinner();
        if(count==9 && !iswin){
            gamedrawn();
        }
    })
});
const gamedrawn=()=>{
    msg.innerText=`Game Drawn`;
    msgContainer.classList.remove("hide");
    disabledbox();
   
}
const checkwinner =()=>{
    for(pattern of winPatterns){
     
        var value1=boxes[pattern[0]].innerText;
        var value2=boxes[pattern[1]].innerText;
        var value3=boxes[pattern[2]].innerText;

        if(value1 != "" && value2!="" && value3!=""){
            if(value1===value2 && value2===value3 && value3===value1){
                showWinner(value1);
            }
        }
    }
}
const disabledbox=()=>{
    for(let box of boxes){
        box.disabled=true;
    }
}
const enabledbox=()=>{
    for(let box of boxes){
        box.disabled=false;
        box.innerHTML="";
    }
    msgContainer.classList.add("hide");
}
const showWinner=(winner)=>{
    console.log("winner")
    msg.innerText=`Congratulation Winner is : ${winner}`;
    msgContainer.classList.remove("hide");
    disabledbox();
}

const restart=()=>{
     count=0;   
     enabledbox();
}

newbtn.addEventListener("click",restart);
resetbtn.addEventListener("click",restart);