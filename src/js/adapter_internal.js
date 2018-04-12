const NRF_SUCCESS = 0;
const NRF_ERROR_INTERNAL = 3;
const NRF_ERROR_TIMEOUT = 13;
const NRF_ERROR_INVALID_DATA = 11;



class AdapterInternal {
    constructor(self, serializationTransport) {
        this.self = self;
        this.eventCallback = null;
        this.statusCallback = null;
        this.logCallback = null;
        //logseverityfilter
        this.transport = serializationTransport;
    }

    statusHandler(code, message){
        //ccall('adapterStatusHandler', 'void', ['number', 'number', 'string'], [this.self, code, message]);
    }
    eventHandler(event){
        var data = Uint8Array.from(event);
        buffer = Module._malloc(data.length)
        Module.HEAPU8.set(data, buffer);
        //ccall('adapterEventHandler', 'void', ['number', 'number', 'number'], [this.self, buffer, data.length]);
        _free(buffer);
    }
    logHandler(severity, log_message){
        // If severity greater than
        //ccall('adapterLogHandler', 'void', ['number', 'number', 'string'], [this.self, severity, log_message]);
    }

    async open(/*status_callback, event_callback, log_callback*/) {

        var boundStatusHandler = this.statusHandler.bind(this);
        var boundEventHandler = this.eventHandler.bind(this);
        var boundLogHandler = this.logHandler.bind(this);
        console.log("Adapter before")
        var res = await this.transport.open(boundStatusHandler, boundEventHandler, boundLogHandler);
        console.log("Adapter after")
        return res;
    }
    isInternalError(error_code){
        if(error_code !== NRF_SUCCESS){
            return true;
        }
        else {
            return false;
        }
    }
    logSeverityFilterSet(severity_filter){
        this.logseverityfilter = severity_filter;
        return NRF_SUCCESS;
    }







}
