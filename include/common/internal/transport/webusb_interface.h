/*
 * Copyright (c) 2016 Nordic Semiconductor ASA
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *   1. Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 *   2. Redistributions in binary form must reproduce the above copyright notice, this
 *   list of conditions and the following disclaimer in the documentation and/or
 *   other materials provided with the distribution.
 *
 *   3. Neither the name of Nordic Semiconductor ASA nor the names of other
 *   contributors to this software may be used to endorse or promote products
 *   derived from this software without specific prior written permission.
 *
 *   4. This software must only be used in or with a processor manufactured by Nordic
 *   Semiconductor ASA, or in or with a processor manufactured by a third party that
 *   is used in combination with a processor manufactured by Nordic Semiconductor.
 *
 *   5. Any software provided in binary or object form under this license must not be
 *   reverse engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef WEBUSB_INTERFACE_H
#define WEBUSB_INTERFACE_H

#include "transport.h"
#include <emscripten.h>
#include <emscripten/bind.h>

class WebusbInterface : public Transport
{
public:


    WebusbInterface();

   /// ~WebusbInterface();


    uint32_t open(status_cb_t status_callback, data_cb_t data_callback, log_cb_t log_callback);
    uint32_t close();
    uint32_t send(std::vector<uint8_t> &data);
	uint32_t dataReceived(uint8_t *data, uint32_t length);

};
/*
using namespace emscripten;

class WebusbInterfaceWrapper : public emscripten::wrapper<WebusbInterface> 
{
    EMSCRIPTEN_WRAPPER(WebusbInterfaceWrapper);
    uint32_t open(status_cb_t status_callback, data_cb_t data_callback, log_cb_t log_callback)
    {
        return call<uint32_t>("open", status_callback, data_callback, log_callback);
    }
};


EMSCRIPTEN_BINDINGS(WebusbInterface) {
    emscripten::class_<WebusbInterface>("WebusbInterface")
        .function("open", &WebusbInterface::open, emscripten::pure_virtual())
        .allow_subclass<WebusbInterfaceWrapper>("WebusbInterfaceWrapper")
        ;
}*/

/*
extern WebusbInterface* currentInterface;
extern std::function<uint32_t(uint8_t*, uint32_t)> emscriptenSendData;

*/

#endif //WEBUSB_INTERFACE_H
