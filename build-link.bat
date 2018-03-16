mingw32-make && em++ -o src/js/pcbleblob.js libpc_ble_driver_static_sd_api_v5.a --pre-js src/js/class_bindings.js ^
-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'getValue','Pointer_stringify', 'intArrayFromString', 'cwrap', 'addFunction']" ^
-s VERBOSE=1 ^
-s RESERVED_FUNCTION_POINTERS=32