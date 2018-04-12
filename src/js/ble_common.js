const SER_HAL_TRANSPORT_MAX_PKT_SIZE = 384;
const PKT_ENCODE_ERROR = -1;

async function encode_decode(adapter, encode_function, decode_function)
{
    console.log("Encode decode!")
    //let tx_buffer_length = SER_HAL_TRANSPORT_MAX_PKT_SIZE;
    //let rx_buffer_length = 0;

    let tx_buffer_length_uint32 = SER_HAL_TRANSPORT_MAX_PKT_SIZE;
    let rx_buffer_length_uint32 = 0;

    let tx_buffer_length = Module._malloc(4);
    let rx_buffer_length = Module._malloc(4);
    Module.setValue(tx_buffer_length, tx_buffer_length_uint32, "i32");
    Module.setValue(rx_buffer_length, rx_buffer_length_uint32, "i32");


    let tx_buffer = Module._malloc(SER_HAL_TRANSPORT_MAX_PKT_SIZE);
    let rx_buffer = Module._malloc(SER_HAL_TRANSPORT_MAX_PKT_SIZE);


    let error_message = "";

    //auto _adapter = static_cast<AdapterInternal*>(adapter->internal);

    let err_code = encode_function(tx_buffer, tx_buffer_length);
    console.log("Error code "+ err_code);
    if (adapter.isInternalError(err_code))
    {
        error_message += "Not able to encode packet. Code #" + err_code;
        adapter.statusHandler(PKT_ENCODE_ERROR, error_message);

        Module._free(tx_buffer);
        Module._free(tx_buffer_length);
        Module._free(rx_buffer);
        Module._free(rx_buffer_length);

        return NRF_ERROR_INTERNAL;
    }

    if (decode_function !== undefined)
    {
        err_code = await adapter.transport.send(
            tx_buffer,
            tx_buffer_length,
            rx_buffer,
            rx_buffer_length);
    }
    else
    {
        err_code = await adapter.transport.send(
            tx_buffer,
            tx_buffer_length,
            nullptr,
            rx_buffer_length);
    }
    Module._free(tx_buffer);
    Module._free(tx_buffer_length);
    console.log("Response received!")

    if (adapter.isInternalError(err_code))
    {
        //error_message << "Error sending packet to target. Code #" << err_code;
        let error_message = "Error sending packet to target. Code #" + err_code;
        console.log(error_message);
        adapter.statusHandler(PKT_SEND_ERROR, error_message);

        Module._free(rx_buffer);
        Module._free(rx_buffer_length);

        return NRF_ERROR_INTERNAL;
    }

    let result_code = Module._malloc(4);
    Module.setValue(result_code, NRF_SUCCESS, "i32");

    if (decode_function !== undefined)
    {
        let rx_buffer_length_value = Module.getValue(rx_buffer_length, "i32");
        err_code = decode_function(rx_buffer, rx_buffer_length_value, result_code);
    }
    let result_code_value = Module.getValue(result_code, "i32");
    Module._free(result_code);
    Module._free(rx_buffer);
    Module._free(rx_buffer_length);

    if (adapter.isInternalError(err_code))
    {
        //error_message << "Not able to decode packet. Code #" << err_code;
        let error_message = "Not able to decode packet. Code #" + err_code;
        adapter.statusHandler(PKT_DECODE_ERROR, error_message);
        return NRF_ERROR_INTERNAL;
    }


    return result_code_value;
}
