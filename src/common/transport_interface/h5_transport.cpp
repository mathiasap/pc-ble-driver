#include "h5_transport.h"
#include <emscripten.h>

H5Transport::H5Transport(Transport *nextTransportLayer, uint32_t retransmission_interval)
{
    EM_ASM({
        H5TransportBinding.construct($0, $1, $2);
    }, this, nextTransportLayer, retransmission_interval);
}
