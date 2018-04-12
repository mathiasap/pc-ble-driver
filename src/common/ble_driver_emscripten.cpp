#include "adapter.h"
#include "ble_common.h"

#include "ble.h"
#include "ble_app.h"

#include <stdint.h>
#include "Emscripten.h"

#if NRF_SD_BLE_API_VERSION < 4
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    ble_enable_params_t * createBleParams()
    {
        ble_enable_params_t* ble_enable_params = new ble_enable_params_t;

        #if NRF_SD_BLE_API == 3
            ble_enable_params->gatt_enable_params.att_mtu = GATT_MTU_SIZE_DEFAULT;
        #elif NRF_SD_BLE_API < 3
            ble_enable_params->gatts_enable_params.attr_tab_size = BLE_GATTS_ATTR_TAB_SIZE_DEFAULT;
            ble_enable_params->gatts_enable_params.service_changed = false;
            ble_enable_params->gap_enable_params.periph_conn_count = 1;
            ble_enable_params->gap_enable_params.central_conn_count = 0;
            ble_enable_params->gap_enable_params.central_sec_count = 0;
            ble_enable_params->common_enable_params.p_conn_bw_counts = NULL;
            ble_enable_params->common_enable_params.vs_uuid_count = 1;
        #endif
        return ble_enable_params;
    }
}
#endif

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    uint32_t emscripten_ble_enable_req_enc(
        #if NRF_SD_BLE_API_VERSION < 4
        ble_enable_params_t * p_params,
        #endif
        uint8_t * const       buffer,
        uint32_t * const      length
    )
    {
        return ble_enable_req_enc(
            #if NRF_SD_BLE_API_VERSION < 4
                        p_params,
            #endif
                        buffer,
                        length);

    }

    EMSCRIPTEN_KEEPALIVE
    uint32_t emscripten_ble_enable_rsp_dec(
        uint8_t const * const p_buf,
        uint32_t              packet_len,
        uint32_t * const      p_result_code)
    {
        return ble_enable_rsp_dec(
            p_buf,
            packet_len,
            p_result_code);
    }
}
