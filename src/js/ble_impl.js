async function sd_ble_enable(adapter, p_params, p_app_ram_base)
{
    function encode_function(buffer, length) {
        return Module.ccall('emscripten_ble_enable_req_enc', 'number', ['number', 'number', 'number'], [p_params, buffer, length]);
    };

    function decode_function(buffer, length, result) {
        return Module.ccall('emscripten_ble_enable_rsp_dec', 'number', ['number', 'number', 'number'], [buffer, length, result]);
    };

    return await encode_decode(adapter, encode_function, decode_function);
}

async function sd_ble_gap_adv_data_set(adapter, data_buffer, index, sr_data, sr_data_length)
{
    function encode_function(buffer, length) {
        return Module.ccall('emscripten_ble_gap_adv_data_set_req_enc', 'number', ['number', 'number', 'number', 'number', 'number', 'number'], [data_buffer, index, sr_data, sr_data_length, buffer, length]);
    };

    function decode_function(buffer, length, result) {
        return Module.ccall('emscripten_ble_gap_adv_data_set_rsp_dec', 'number', ['number', 'number', 'number'], [buffer, length, result]);
    };

    return await encode_decode(adapter, encode_function, decode_function);
}


async function sd_ble_gap_scan_start(adapter, scanParam) {

    function encode_function(buffer, length) {
        return Module.ccall('emscripten_ble_gap_scan_start_req_enc', 'number', ['number', 'number', 'number'], [scanParam, buffer, length]);
    };

    function decode_function(buffer, length, result) {
        return Module.ccall('emscripten_ble_gap_scan_start_rsp_dec', 'number', ['number', 'number', 'number'], [buffer, length, result]);
    };

    return await encode_decode(adapter, encode_function, decode_function);
}
