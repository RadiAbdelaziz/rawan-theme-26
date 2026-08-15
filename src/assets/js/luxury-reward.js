document.addEventListener("DOMContentLoaded", function(){

const section = document.querySelector('.luxury-reward-section');

if(!section){
    return;
}


const targetAmount = Number(
    section.dataset.rewardAmount || 110
);


const progressBar = section.querySelector(
    '.luxury-reward-bar-fill'
);


const statusText = section.querySelector(
    '.luxury-reward-status strong'
);


const steps = section.querySelectorAll(
    '.luxury-reward-step'
);



function updateReward(cartTotal){


let percent = (cartTotal / targetAmount) * 100;


if(percent > 100){
    percent = 100;
}


if(progressBar){

progressBar.style.width = percent + "%";

}



if(steps.length){


steps.forEach(step=>{
    step.classList.remove('active');
});


if(percent >= 1){
    steps[0].classList.add('active');
}


if(percent >= 100){

    steps[1].classList.add('active');

}


if(cartTotal >= targetAmount){

    steps[2].classList.add('active');

}

}



if(statusText){

if(cartTotal >= targetAmount){

statusText.innerText =
"تم فتح المكافأة 🎁";

}else{

let remain =
targetAmount - cartTotal;


statusText.innerText =
"أضيفي " + remain + " للحصول على المكافأة";

}


}


}



if(window.salla){


salla.cart.event.onUpdated(summary=>{


updateReward(
Number(summary.total.amount || summary.total)
);


});


}



});