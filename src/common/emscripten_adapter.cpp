#include "sd_rpc.h"
#include <emscripten.h>
#include "webusb_interface.h"
#include <thread>

static void sd_rpc_on_status(adapter_t *adapter, sd_rpc_app_status_t id, const char * message)
{

}

static void sd_rpc_on_event(adapter_t *adapter, ble_evt_t *event)
{
    emscripten_run_script("alert('event handler!')");

}

void sd_rpc_on_log_event(adapter_t *adapter, sd_rpc_log_severity_t severity, const char *log_message)
{

}

using DebugFunction = std::shared_ptr<std::function<uint32_t(const char*)>>;
DebugFunction emscriptenDebugOut;

extern "C" {
	EMSCRIPTEN_KEEPALIVE
    void emscriptenSetDebugOut(uint32_t(*f)(const char*))
    {
        emscriptenDebugOut = std::make_shared<std::function<uint32_t(const char*)>>(f);
    }
}

#include <sstream>
#include <cstring>

template<typename T>
const char *createEmscriptenDebugText(T t)
{
    std::ostringstream stream;
    stream << t;
    return stream.str().c_str();
}

template<typename T, typename ...U>
const char *createEmscriptenDebugText(T t, U... u)
{
    std::ostringstream stream;
    stream << t << createEmscriptenDebugText(u...);
    return stream.str().c_str();
}

extern "C" {
  extern void my_js(const char* str);
}
std::vector<std::unique_ptr<std::thread>> adapterThreads;

void openAdapterAsync(void/*std::function<void(void)> f*/)
{
    int retransmission_interval = 5000;
    int response_timeout = 5000;

    auto webusb = sd_rpc_physical_layer_create_webusb();
    auto h5 = sd_rpc_data_link_layer_create_bt_three_wire(webusb, retransmission_interval);
    auto serialization = sd_rpc_transport_layer_create(h5, response_timeout);
    auto adapter = sd_rpc_adapter_create(serialization);

    //auto error_code = sd_rpc_log_handler_severity_filter_set(adapter, 0);
    auto error_code = sd_rpc_open(adapter, sd_rpc_on_status, sd_rpc_on_event, sd_rpc_on_log_event);

    //Does not work because function pointer table is not available in thread
    my_js(createEmscriptenDebugText("result from open: ",error_code));
    //(*emscriptenDebugOut)(out);

}


extern "C" {

	EMSCRIPTEN_KEEPALIVE
    int emscriptenOpenAdapter()
    {
        int retransmission_interval = 5000;
        int response_timeout = 5000;

        auto webusb = sd_rpc_physical_layer_create_webusb();
        auto h5 = sd_rpc_data_link_layer_create_bt_three_wire(webusb, retransmission_interval);
        auto serialization = sd_rpc_transport_layer_create(h5, response_timeout);
        auto adapter = sd_rpc_adapter_create(serialization);

        auto error_code = sd_rpc_open(adapter, sd_rpc_on_status, sd_rpc_on_event, sd_rpc_on_log_event);
        return 0;
    }
}
