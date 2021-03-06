#include "webusb_interface.h"

#include <emscripten.h>

#include <emscripten/val.h>

// Used so emscripen bindings know which object to send data to


WebusbInterface* currentInterface;

std::function<uint32_t(uint8_t*, uint32_t)> sendDataToEmscripten;

// extern "C" prevents C++ name mangling

extern "C" {

	EMSCRIPTEN_KEEPALIVE
	uint32_t emscriptenDataReady(uint8_t *data, size_t length)
	{
		if(currentInterface != NULL)
		{
			currentInterface->dataReceived(data, length);
			return NRF_SUCCESS;
		}
		return -1;
	}

	EMSCRIPTEN_KEEPALIVE
		uint32_t emscriptenSetSendptr(uint32_t(*f)(uint8_t*, uint32_t))
		{
			sendDataToEmscripten = *f;
			if(sendDataToEmscripten == NULL)
			{
				return 1;
			}
			return 0;
		}
}



void setCurrentInterface(WebusbInterface* interface)
{
	currentInterface = interface;
}



WebusbInterface::WebusbInterface() 
:Transport()
{
	setCurrentInterface(this);
}

uint32_t WebusbInterface::open(status_cb_t status_callback, data_cb_t data_callback, log_cb_t log_callback)
{
	
	 Transport::open(status_callback, data_callback, log_callback);
	 setCurrentInterface(this);
	 std::vector<uint8_t> data;
	 return NRF_SUCCESS;
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

uint32_t WebusbInterface::dataReceived(uint8_t *data, size_t length)
{
	//emscripten_run_script("alert('data received!')");
	//emscripten_run_script(createEmscriptenDebugText("console.log('Data received: ",data[0],"')"));

	dataCallback(data,length);

	std::vector<uint8_t> sendvec;
	sendvec.push_back(5);
	sendvec.push_back(15);
	 send(sendvec);

	return NRF_SUCCESS;
}

uint32_t WebusbInterface::send(std::vector<uint8_t> &data)
{
	if (sendDataToEmscripten != NULL)
	{
		uint8_t* sendBuffer = new uint8_t[data.size()];
		memcpy(sendBuffer, &data[0], data.size());
		return sendDataToEmscripten(sendBuffer, data.size());

	}
	return 1;
}

uint32_t WebusbInterface::close()
{
	return 0;
}