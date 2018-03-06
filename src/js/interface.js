//const WebusbInterface = require('./transport/webusb_interface');
//const H5Transport = require('./transport/h5_transport');

function statusCallback(code, message){

}
function logCallback(severity, length){

}
function dataCallback(data, length){

}

async function openAdapter(){
    let webusb = new WebusbInterface();
    let h5 = new H5Transport(webusb, 5000);
    console.log("opening");
    let res = await h5.open(statusCallback, dataCallback, logCallback)
    console.log("Back to interface");
    console.log(res)

}
//openAdapter();

window.onload = function(){
    document.querySelector("#openAdapter").onclick = openAdapter
}
