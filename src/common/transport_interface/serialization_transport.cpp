#include "serialization_transport.h"
#include <emscripten.h>
SerializationTransport::SerializationTransport(Transport *dataLinkLayer, uint32_t response_timeout)
{
    EM_ASM({
        SerializationTransportBinding.construct($0, $1, $2);
    }, this, dataLinkLayer, response_timeout);
}

uint32_t SerializationTransport::send(uint8_t *cmdBuffer, uint32_t cmdLength, uint8_t *rspBuffer, uint32_t *rspLength)
{
    int err = EM_ASM_INT({
        console.log("Trying to send data to adapter..")
        //return SerializationTransportBinding.get($0).send($1, $2, $3. $4);
    },this, &cmdBuffer[0], cmdLength, &rspBuffer[0], rspLength);
    return err;
}