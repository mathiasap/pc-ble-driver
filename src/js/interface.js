const WebusbInterface = require('./transport/webusb_interface');
const H5Transport = require('./transport/h5_transport');

function openAdapter(){
    let webusb = new WebusbInterface();
    let h5 = new H5Transport(webusb, 5000);

}
openAdapter();
