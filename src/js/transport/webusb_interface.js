const Transport = require('./transport');

const NRF_SUCCESS = 0;

class WebusbInterface extends Transport{

    open(status_callback, data_callback, log_callback){
        super.open(status_callback, data_callback, log_callback);
    }
    close(){
        return 0;
    }

    dataReceived(data, length){
        this.dataCallback(data,length);
    }
    send(data){
        //webusb binding
    }

}

module.exports = WebusbInterface;
