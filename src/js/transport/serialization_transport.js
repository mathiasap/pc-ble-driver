const serialization_pkt_type_t = Object.freeze({
    SERIALIZATION_COMMAND:0,
    SERIALIZATION_RESPONSE:1,
    SERIALIZATION_EVENT:2
});


class SerializationTransport {

    constructor(dataLinkLayer, response_timeout){
        this.statusCallback = null;
        this.eventCallback = null;
        this.logCallback = null;

        this.rspReceived = false;
        this.responseBuffer = null;
        this.responseLength = null;
        this.runEventThread = false;

        this.nextTransportLayer = dataLinkLayer;
        this.responseTimeout = response_timeout;

        this.eventQueue = [];

    }
    async open(status_callback, event_callback, log_callback){
        this.statusCallback = status_callback;
        this.eventCallback = event_callback;
        this.logCallback = log_callback;
        let errorCode = await this.nextTransportLayer.open(this.statusCallback, this.readHandler.bind(this), this.logCallback);
        if(errorCode !== NRF_SUCCESS){
            return errorCode;
        }

        // runEventThread

        return NRF_SUCCESS;

    }
    close(){

    }
    send(cmdBuffer, cmdLength, rspBuffer, rspLength){

    }

    readHandler(data, length){
        let eventType = data[0];

        if(eventType === serialization_pkt_type_t.SERIALIZATION_RESPONSE){
            this.responseBuffer.set(data.slice(1));
            this.responseLength = length-1;
            this.rspReceived = true;
            //response wait notify one
        }
        else if(eventType === serialization_pkt_type_t.SERIALIZATION_EVENT){
            let eventData = new Uint8Array(length-1);
            this.eventQueue.push(eventData);
            //notify one
        }
        else {
            this.logCallback(SD_RPC_LOG_WARNING, "Unknown Nordic Semiconductor vendor specific packet received");
        }

    }

    eventHandlingRunner(){
        let eventQueuePtr = 0;
        while(eventQueuePtr < this.eventQueue.length)
        {
            const eventData = this.eventQueue[eventQueuePtr++]; 
        }
        this.eventQueue.length = 0;
    }

}
