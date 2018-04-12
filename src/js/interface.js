//const WebusbInterface = require('./transport/webusb_interface');
//const H5Transport = require('./transport/h5_transport');

function statusCallback(code, message){

}
function logCallback(severity, length){

}
function dataCallback(data, length){

}

async function openAdapter(){
    const webusb = new WebusbInterface(null);
    const h5 = new H5Transport(null, webusb, 5000);
    const serialization = new SerializationTransport(null, h5, 5000);
    const adapter = new AdapterInternal(null, serialization);
    await adapter.open();
    console.log("Opened");

    let p_params = Module.ccall('createBleParams', 'number', [], []);
    //let p_params = null;
    await sd_ble_enable(adapter, p_params, null);
    console.log("Done")
    Module._free(p_params);

    //console.log("opening");
    //var res = await serialization.open(statusCallback, dataCallback, logCallback)
    //console.log("Back to interface");
    //console.log(res)
    //console.log("Attempting to open adapter")
    //var res = Module.ccall('emscriptenOpenAdapter', 'number', [], []);

    //await Module.ccall('heartRateOpenAdapter', '', [], [], { async: false });
    //console.log(res)
    /*
    setTimeout(() =>{
    Module.ccall('heartRateExample', 'number', [], [], { async: true });
},7000);*/
    //res = Module.ccall('heartRateExample', 'number', [], []);

    //console.log("Open adapter attempt done")



}
//openAdapter();

window.onload = function(){
    document.querySelector("#openAdapter").onclick = openAdapter
}
