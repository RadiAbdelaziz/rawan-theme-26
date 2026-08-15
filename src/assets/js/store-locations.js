document.addEventListener("DOMContentLoaded", function(){


const mapElement = document.querySelector('#store-map');


if(!mapElement){
    return;
}



if(typeof L === "undefined"){
    return;
}



let defaultLat = 24.7136;
let defaultLng = 46.6753;



let map = L.map("store-map")
.setView(
[
defaultLat,
defaultLng
],
10
);



L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
 attribution:"© OpenStreetMap"
}
).addTo(map);



let marker = L.marker(
[
defaultLat,
defaultLng
]
)
.addTo(map)
.bindPopup("الفرع الرئيسي")
.openPopup();





document.querySelectorAll(".store-branch-card")
.forEach(function(button){


button.addEventListener(
"click",
function(){


let lat = parseFloat(this.dataset.lat);

let lng = parseFloat(this.dataset.lng);

let name = this.dataset.name;



if(!lat || !lng){
    return;
}



map.flyTo(
[
lat,
lng
],
13,
{
    animate:true,
    duration:1
}
);



marker
.setLatLng(
[
lat,
lng
]
)
.bindPopup(
"فرع " + name
)
.openPopup();




document
.querySelectorAll(".store-branch-card")
.forEach(card=>{
    card.classList.remove("active");
});


this.classList.add("active");



}
);


});



});