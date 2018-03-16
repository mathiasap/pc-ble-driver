#include "webusb_interface.h"
#include <emscripten.h>

WebusbInterface::WebusbInterface()
{
    EM_ASM({
        WebusbInterfaceBinding.construct($0);
    }, this);
}
