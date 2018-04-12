const serialization_pkt_type_t = Object.freeze({
    SERIALIZATION_COMMAND:0,
    SERIALIZATION_RESPONSE:1,
    SERIALIZATION_EVENT:2
});


class SerializationTransport {

    constructor(self, dataLinkLayer, response_timeout){
        this.self = self;
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

        var errorCode = await this.nextTransportLayer.open(this.statusCallback, this.readHandler.bind(this), this.logCallback);
        if(errorCode !== NRF_SUCCESS){
            return errorCode;
        }

        // runEventThread

        return NRF_SUCCESS;

    }
    close(){

    }
    async send(cmdBuffer, cmdLength, rspBuffer, rspLength){
        this.rspReceived = false;
        this.responseBuffer = rspBuffer;
        this.responseLength = rspLength;

        let commandBuffer = [serialization_pkt_type_t.SERIALIZATION_COMMAND];
        let commandLength = Module.getValue(cmdLength, "i32")
        console.log("Command length "+commandLength)
        let strArr =  Module.Pointer_stringify(cmdBuffer, (commandLength));
        let arr = Module.intArrayFromString(strArr,false);
        console.log(arr)
        Module._free(cmdBuffer);


        commandBuffer.push.apply(commandBuffer, arr);
        //commandBuffer = [0x0, 0x60, 0x01, 0x0A, 0x00, 0x00, 0x01, 0x07, 0x01, 0x00, 0xF7, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        commandBuffer = new Uint8Array(commandBuffer);

        let errCode = await this.nextTransportLayer.send(commandBuffer);




    }

    readHandler(data, length){
        var eventType = data[0];
        console.log("READ HANDLER")
        if(eventType === serialization_pkt_type_t.SERIALIZATION_RESPONSE){
            this.responseBuffer.set(data.slice(1));
            this.responseLength = length-1;
            this.rspReceived = true;
            //response wait notify one
        }
        else if(eventType === serialization_pkt_type_t.SERIALIZATION_EVENT){
            var eventData = new Uint8Array(length-1);
            this.eventQueue.push(eventData);
            //notify one
        }
        else {
            this.logCallback(SD_RPC_LOG_WARNING, "Unknown Nordic Semiconductor vendor specific packet received");
        }

    }

    eventHandlingRunner(){
        var eventQueuePtr = 0;
        while(eventQueuePtr < this.eventQueue.length)
        {
            const eventData = this.eventQueue[eventQueuePtr++];

        }
        this.eventQueue.length = 0;
    }

}
