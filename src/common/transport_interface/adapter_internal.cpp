#include "adapter_internal.h"
#include <emscripten.h>

AdapterInternal::AdapterInternal(SerializationTransport *transport): transport(transport)
{
    EM_ASM({
        AdapterInternalBinding.construct($0,$1);
    },this, transport);

}


void AdapterInternal::statusHandler(sd_rpc_app_status_t code, const char * message)
{/*
    adapter_t adapter;
    adapter.internal = static_cast<void *>(this);
    statusCallback(&adapter, code, message);*/
}

void AdapterInternal::eventHandler(ble_evt_t *event)
{
    // Event Thread
    /*adapter_t adapter;
    adapter.internal = static_cast<void *>(this);
    eventCallback(&adapter, event);*/
}

void AdapterInternal::logHandler(sd_rpc_log_severity_t severity, std::string log_message)
{
    /*adapter_t adapter;
    adapter.internal = static_cast<void *>(this);

    if((uint32_t) severity >= (uint32_t) logSeverityFilter)
    {
        logCallback(&adapter, severity, log_message.c_str());
    }*/
}

bool AdapterInternal::isInternalError(const uint32_t error_code) {
    if (error_code != NRF_SUCCESS) {
        return true;
    }
    else
    {
        return false;
    }
}

uint32_t AdapterInternal::logSeverityFilterSet(sd_rpc_log_severity_t severity_filter)
{
    //logSeverityFilter = severity_filter;
    return NRF_SUCCESS;
}
uint32_t AdapterInternal::close() const
{
    return 0;
}

uint32_t AdapterInternal::open(const sd_rpc_status_handler_t status_callback, const sd_rpc_evt_handler_t event_callback, const sd_rpc_log_handler_t log_callback)
{
    /*statusCallback = status_callback;
    eventCallback = event_callback;
    logCallback = log_callback;

    auto boundStatusHandler = std::bind(&AdapterInternal::statusHandler, this, std::placeholders::_1, std::placeholders::_2);
    auto boundEventHandler = std::bind(&AdapterInternal::eventHandler, this, std::placeholders::_1);
    auto boundLogHandler = std::bind(&AdapterInternal::logHandler, this, std::placeholders::_1, std::placeholders::_2);
    return transport->open(boundStatusHandler, boundEventHandler, boundLogHandler);*/

    int retval = EM_ASM_INT({

        AdapterInternalBinding.get($0).open($1, $2, $3);
    },this, 0,0,0); // Howto send function pointers??
    return 0;
}
