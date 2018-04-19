#include "adapter.h"
#include "ble_common.h"

#include "ble.h"
#include "ble_app.h"
#include "ble_gap_app.h"

#include <stdint.h>
#include "Emscripten.h"

#define ADV_BUFFER_SIZE 30
const char* DEVICE_NAME = "Emscripten";
#define BLE_UUID_HEART_RATE_SERVICE          0x180

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
    uint8_t * createAdvData(uint8_t* index)
    {
        uint32_t error_code;
        //uint8_t  data_buffer[ADV_BUFFER_SIZE];
        uint8_t*  data_buffer = new uint8_t[ADV_BUFFER_SIZE];
        const char  * device_name = DEVICE_NAME;
        const uint8_t name_length = (uint8_t)strlen(device_name);
        const uint8_t data_type   = BLE_GAP_AD_TYPE_COMPLETE_LOCAL_NAME;

        // Set the device name.
        data_buffer[(*index)++] = name_length + 1; // Device name + data type
        data_buffer[(*index)++] = data_type;
        memcpy((char *)&data_buffer[*index], device_name, name_length);
        *index += name_length;

        // Set the device's available services.
        data_buffer[(*index)++] = 3;
        data_buffer[(*index)++] = BLE_GAP_AD_TYPE_16BIT_SERVICE_UUID_COMPLETE;
        // Store BLE_UUID_HEART_RATE_SERVICE in little-endian format.
        data_buffer[(*index)++] = BLE_UUID_HEART_RATE_SERVICE & 0xFF;
        data_buffer[(*index)++] = (BLE_UUID_HEART_RATE_SERVICE & 0xFF00) >> 8;
/*
        data_buffer[(*index)++] = 2;
        data_buffer[(*index)++] = BLE_GAP_AD_TYPE_16BIT_SERVICE_UUID_COMPLETE;
        // Store BLE_UUID_HEART_RATE_SERVICE in little-endian format.
        data_buffer[(*index)++] = 0x6;
        data_buffer[(*index)++] = 0x2;
*/
         return data_buffer;
    }
}

#define SCAN_INTERVAL 0x00A0 /**< Determines scan interval in units of 0.625 milliseconds. */
#define SCAN_WINDOW   0x0050 /**< Determines scan window in units of 0.625 milliseconds. */
#define SCAN_TIMEOUT  0x10    /**< Scan timeout between 0x01 and 0xFFFF in seconds, 0x0 disables timeout. */
extern "C" {
    EMSCRIPTEN_KEEPALIVE
    ble_gap_scan_params_t * createScanParam()
    {
        ble_gap_scan_params_t *m_scan_param = new ble_gap_scan_params_t({
            1,                       // Active scanning set.
            0,                       // Selective scanning not set.
        #if NRF_SD_BLE_API == 2
            NULL,                    // White-list not set.
        #endif
        #if NRF_SD_BLE_API >= 3
            0,                       // adv_dir_report not set.
        #endif

            (uint16_t)SCAN_INTERVAL,
            (uint16_t)SCAN_WINDOW,
            (uint16_t)SCAN_TIMEOUT
        });

        return m_scan_param;

    }
}

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






extern "C" {
    EMSCRIPTEN_KEEPALIVE
    uint32_t emscripten_ble_gap_adv_data_set_req_enc(uint8_t const * const p_data,
                                      uint8_t               dlen,
                                      uint8_t const * const p_sr_data,
                                      uint8_t               srdlen,
                                      uint8_t * const       p_buf,
                                      uint32_t * const      p_buf_len)
    {

        return ble_gap_adv_data_set_req_enc(p_data, dlen, p_sr_data, srdlen, p_buf, p_buf_len);

    }

    EMSCRIPTEN_KEEPALIVE
    uint32_t emscripten_ble_gap_adv_data_set_rsp_dec(uint8_t const * const p_buf,
                                      uint32_t              packet_len,
                                      uint32_t * const      p_result_code)
    {
        return ble_gap_adv_data_set_rsp_dec(p_buf, packet_len, p_result_code);
    }

}


extern "C" {
    EMSCRIPTEN_KEEPALIVE
    uint32_t emscripten_ble_gap_scan_start_req_enc(ble_gap_scan_params_t const *  p_scan_params,
                                    uint8_t * const                p_buf,
                                    uint32_t * const               p_buf_len)
    {

        return ble_gap_scan_start_req_enc(p_scan_params, p_buf, p_buf_len);

    }

    EMSCRIPTEN_KEEPALIVE
    uint32_t emscripten_ble_gap_scan_start_rsp_dec(uint8_t const * const p_buf,
                                      uint32_t              packet_len,
                                      uint32_t * const      p_result_code)
    {
        return ble_gap_scan_start_rsp_dec(p_buf, packet_len, p_result_code);
    }

}

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    uint32_t emscripten_ble_event_dec(
        uint8_t const * const p_buf,
        uint32_t              packet_len,
        ble_evt_t * const     p_event,
        uint32_t * const      p_event_len)
       {

           return ble_event_dec(p_buf, packet_len, p_event, p_event_len);
       }
   }