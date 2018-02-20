const NRF_SUCCESS = 0;

class AdapterInternal {
    constructor(serializationTransport) {
        this.eventCallback = null;
        this.statusCallback = null;
        this.logCallback = null;
        //logseverityfilter
        this.transport = serializationTransport;
    }

    statusHandler(code, message){
        statusCallback(this, code, message);
    }
    eventHandler(event){
        eventCallback(this, event);
    }
    logHandler(severity, log_message){
        // If severity greater than
        logCallback(this, severity, log_message);
    }

    open(status_callback, event_callback, log_callback) {
        this.eventCallback = event_callback;
        this.statusCallback = status_callback;
        this.logCallback = log_callback;

        boundStatusHandler = this.statusHandler.bind(this);
        boundEventHandler = this.eventHandler.bind(this);
        boundLogHandler = this.logHandler.bind(this);

        return this.transport.open(boundStatusHandler, boundEventHandler, boundLogHandler);
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
