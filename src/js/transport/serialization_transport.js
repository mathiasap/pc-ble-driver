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
        this.didTimeout = false;


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
        let arr = Module.intArrayFromString(strArr,true);
        console.log(arr)
        Module._free(cmdBuffer);


        commandBuffer.push.apply(commandBuffer, arr);
        commandBuffer = new Uint8Array(commandBuffer);

        //commandBuffer = new Uint8Array([0x60/*,0x00,0x60,0x01,0x0a,0x00,0x00,0x01,0x07,0x01,0x00,0x00,0x00,0x00,0x00,0xe4*/]);
        this.didTimeout = false;
        let sendTimeoutFunc = function(){
            this.didTimeout = true;
            let dataReadyEvent = new CustomEvent('dataReadyEvent', {"detail": {"status":NRF_ERROR_INTERNAL}});
            dispatchEvent(dataReadyEvent);
        };

        let errCode = await this.nextTransportLayer.send(commandBuffer);
        this.timeoutEvent = setTimeout(sendTimeoutFunc.bind(this),3000);

        return new Promise( resolve =>{
            function dataRcvdResolve(evt){
                console.log(evt.detail)
                removeEventListener('dataReadyEvent', boundDataRcvdResolve);
                resolve(evt.detail.status);
            };
            let boundDataRcvdResolve = dataRcvdResolve.bind(this);
            addEventListener('dataReadyEvent', boundDataRcvdResolve);
        });
    }

    readHandler(data, length){
        if(this.didTimeout){
            return;
        }
        var eventType = data[0];
        console.log("READ HANDLER");

        let dataReadyEvent = new CustomEvent('dataReadyEvent', {"detail": {"status":NRF_SUCCESS}});
        if(eventType === serialization_pkt_type_t.SERIALIZATION_RESPONSE){
            console.log(this.responseBuffer);

            Module.writeArrayToMemory(data.slice(1), this.responseBuffer);
            Module.setValue(this.responseLength, length-1, "i32");
            this.rspReceived = true;
            clearTimeout(this.timeoutEvent);
            dispatchEvent(dataReadyEvent);

        }
        else if(eventType === serialization_pkt_type_t.SERIALIZATION_EVENT){
            var eventData = new Uint8Array(length-1);
            this.eventQueue.push(eventData);
            clearTimeout(this.timeoutEvent);
            dispatchEvent(dataReadyEvent);
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
