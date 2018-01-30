

const pcble = require('./out')
console.log("test")



/*
This function is called from C++ when data is ready
*/
function receiveDataFromEmscripten(pointer, length) {
  arrayStr = pcble.Pointer_stringify(pointer, length)
  pcble._free(pointer, length);
  array = pcble.intArrayFromString(arrayStr, length)
  
  console.log(array)
  return 0 // NRF SUCCESS
}

pcble.ccall('emscriptenSetSendptr', 'number', ['number'], [pcble.addFunction(receiveDataFromEmscripten)]);




sendDataToEmscripten = pcble.cwrap('emscriptenDataReady','number',['number', 'number'])
setSendPtr = pcble.cwrap('emscriptenSetSendptr','void',['function'])



function sendData(data, length) {
    
    console.log("got data");
    return 0;
}

function basichello()
{
    console.log("hello world")
}

//pcble.ccall('emscriptenSetSendptr','void',[],basichello);
//pcble.__Z20emscriptenSetSendptrN10emscripten3valE(basichello)


function dataReady(data) {
    
    
    buffer = pcble._malloc(data.length)
    pcble.HEAPU8.set(data, buffer);
    
    num = sendDataToEmscripten(buffer, data.length)
    console.log(num)
    pcble._free(buffer);
}

data = Uint8Array.from([3,2,5,5,7])
dataReady(data)





