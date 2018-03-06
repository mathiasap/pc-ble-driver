//const Transport = require('./transport');

//const NRF_SUCCESS = 0;

class WebusbInterface extends Transport{

    constructor(){
        super();
        this.device = null;
    }
    open(status_callback, data_callback, log_callback){
        super.open(status_callback, data_callback, log_callback);



        //let device;
        return new Promise(resolve => {

            serial.requestPort().then(selectedPort => {
            this.port = selectedPort;
            this.webusbConnect(resolve);
        }).catch(error => {
          console.log("Could not connect to webusb")
        });

    });

    }


    webusbConnect(resolve) {
        console.log("Web usb is connecting..")
        this.port.onReceiveError = error => {
            console.error(error);
        };
        this.port.connect().then(() => {

        this.port.onReceive = this.dataReceived.bind(this);
        this.port.onReceiveError = error => {
            console.error(error);
        };
        //this.send(new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]));

        resolve(NRF_SUCCESS); // Connected!
        }, error => {
            console.log(error)
        });
    }

    close(){
        return 0;
    }

    dataReceived(data){


        data = new Uint8Array(data.buffer);
        //console.log(data.getUint8(0));
        this.dataCallback(data,data.length);
    }
    send(data){
        //console.log("sending data..")
        //console.log(data);
        if(!this.port) {
            return;
        }
        this.port.send(data);
    }

}

//module.exports = WebusbInterface;
