mingw32-make  && em++ -o src/js/pcbleblob.js libpc_ble_driver_static_sd_api_v3.a --pre-js src/js/class_bindings.js ^
-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'getValue', 'setValue','Pointer_stringify', 'intArrayFromString', 'cwrap', 'addFunction', 'writeArrayToMemory']" ^
-s DEMANGLE_SUPPORT=1 ^
-s ASSERTIONS=1