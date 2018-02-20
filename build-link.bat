mingw32-make && em++ -o libpc_ble_driver_static_sd_api_v5.js libpc_ble_driver_static_sd_api_v5.a --js-library pre_js.js ^
-s USE_PTHREADS=2 ^
-s DEMANGLE_SUPPORT=1 ^
-s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall', 'getValue','Pointer_stringify', 'intArrayFromString', 'cwrap', 'addFunction']" ^
-s VERBOSE=1 ^
-s RESERVED_FUNCTION_POINTERS=32 ^
-s ALIASING_FUNCTION_POINTERS=0