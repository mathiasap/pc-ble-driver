#include "adapter_internal.h"
#include <emscripten.h>

#include "ble.h"
#include "ble_app.h"
#include "nrf_error.h"

#include "ble_common.h"

#include <memory>
#include <iostream>
#include <sstream>
#include <cstring> // Do not remove! Required by gcc.

extern "C" {

	EMSCRIPTEN_KEEPALIVE
    void adapterStatusHandler(AdapterInternal* instance, sd_rpc_app_status_t code, const char * message)
    {

        instance->statusHandler(code, message);
    }
}

extern "C" {

	EMSCRIPTEN_KEEPALIVE
    void adapterEventHandler(AdapterInternal* instance, uint8_t *data, uint32_t length)
    {
            uint32_t possibleEventLength = 700;
            std::unique_ptr<ble_evt_t> event(static_cast<ble_evt_t*>(std::malloc(possibleEventLength)));
            uint32_t errCode = ble_event_dec(data, length, event.get(), &possibleEventLength);

            if (instance->eventCallback != nullptr && errCode == NRF_SUCCESS)
            {
                instance->eventHandler(event.get());
            }

            if (errCode != NRF_SUCCESS)
            {
                std::stringstream logMessage;
                logMessage << "Failed to decode event, error code is " << errCode << "." << std::endl;
                instance->logHandler(SD_RPC_LOG_ERROR,logMessage.str().c_str());
                //logCallback(SD_RPC_LOG_ERROR, logMessage.str().c_str());
            }

            //free(data);
        //instance->eventHandler(code, message);
    }
}


extern "C" {

	EMSCRIPTEN_KEEPALIVE
    void adapterLogHandler(AdapterInternal* instance, sd_rpc_log_severity_t severity, std::string log_message)
    {
        instance->logHandler(severity, log_message);
    }
}

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
    EM_ASM({
        console.log("From statushandler");
        console.log($0);
        console.log($1);
    },22, message[1]);
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

uint32_t AdapterInternal::open(/*const sd_rpc_status_handler_t status_callback, const sd_rpc_evt_handler_t event_callback, const sd_rpc_log_handler_t log_callback*/)
{
    /*statusCallback = status_callback;
    eventCallback = event_callback;
    logCallback = log_callback;*/

    auto boundStatusHandler = std::bind(&AdapterInternal::statusHandler, this, std::placeholders::_1, std::placeholders::_2);
    auto boundEventHandler = std::bind(&AdapterInternal::eventHandler, this, std::placeholders::_1);
    auto boundLogHandler = std::bind(&AdapterInternal::logHandler, this, std::placeholders::_1, std::placeholders::_2);
    //return transport->open(boundStatusHandler, boundEventHandler, boundLogHandler);
//emscripten_sleep(10000);
    int retval = EM_ASM_INT({

        var res = AdapterInternalBinding.get($0).open();
        console.log(res);
        return res;
    },this, boundStatusHandler,boundEventHandler,boundLogHandler); // Howto send function pointers??

    EM_ASM({
        console.log("Openy done..");
        console.log($0);
    },retval);

    //std::unique_lock<std::mutex> syncGuard(openMutex);
    //openWaitCondition.wait(syncGuard);
//openWaitCondition.wait(syncGuard);
    return 0;
}
