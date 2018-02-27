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
            this.webusbConnect();
        }).catch(error => {
          console.log("Could not connect to webusb")
        });

    });
    }


    webusbConnect() {
        console.log("Web usb is connecting..")
        this.port.onReceiveError = error => {
            console.error(error);
        };
        this.port.connect().then(() => {

        this.port.onReceive = data => {
            console.log("received data")
            console.log(data.byteLength);
            console.log(data[0]);
        }
        this.port.onReceiveError = error => {
            console.error(error);
        };

        }, error => {
            console.log(error)
        });
    }

    close(){
        return 0;
    }

    dataReceived(data, length){
        this.dataCallback(data,length);
    }
    send(data){
        if(!this.port) {
            return;
        }
        this.port.send(data);
    }

}

//module.exports = WebusbInterface;
