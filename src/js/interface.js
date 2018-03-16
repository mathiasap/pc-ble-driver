//const WebusbInterface = require('./transport/webusb_interface');
//const H5Transport = require('./transport/h5_transport');

function statusCallback(code, message){

}
function logCallback(severity, length){

}
function dataCallback(data, length){

}

async function openAdapter(){
    //const webusb = new WebusbInterface();
    //const h5 = new H5Transport(webusb, 5000);
    //const serialization = new SerializationTransport(h5, 5000);


    //console.log("opening");
    //let res = await serialization.open(statusCallback, dataCallback, logCallback)
    //console.log("Back to interface");
    //console.log(res)
    console.log("Attempting to open adapter")
    let res = Module.ccall('emscriptenOpenAdapter', 'number', [], []);
    console.log(res)
    console.log("Open adapter attempt done")



}
//openAdapter();

window.onload = function(){
    document.querySelector("#openAdapter").onclick = openAdapter
}
