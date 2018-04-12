cmake_minimum_required(VERSION 3.3)

include (cmake/pc-ble-driver.cmake)
#set(EMTERPRETER_OPT "-s EMTERPRETIFY=1 -s EMTERPRETIFY_ASYNC=1")


set(EMTERPRETER_OPT "--memory-init-file 0 -s TOTAL_MEMORY=67108864 -s ABORTING_MALLOC=0 -s EMTERPRETIFY=1 -s EMTERPRETIFY_ASYNC=1 -s NO_EXIT_RUNTIME=1 -s EMTERPRETIFY_BLACKLIST=\"[]\"")

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${EMTERPRETER_OPT}")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wno-long-long -pedantic")
add_definitions(-s ASYNCIFY=1)
add_definitions(-s EMTERPRETIFY=1)
add_definitions(-s EMTERPRETIFY_ASYNC=1)
add_definitions(-s DEMANGLE_SUPPORT=1)



# Common source files
file(GLOB LIB_BASE_C_SRC_FILES "src/common/*.c")
file(GLOB LIB_BASE_CPP_SRC_FILES "src/common/*.cpp")

file(GLOB LIB_TRANSPORT_C_SRC_FILES "src/common/transport_interface/*.c")
file(GLOB LIB_TRANSPORT_CPP_SRC_FILES "src/common/transport_interface/*.cpp")



# SDK source files, different per API version
foreach(SD_API_VER ${SD_API_VERS})
    string(TOLOWER ${SD_API_VER} SD_API_VER_L)
    file(GLOB_RECURSE LIB_SDK_${SD_API_VER}_C_SRC_FILES "src/${SD_API_VER_L}/sdk/*.c")
    file(GLOB_RECURSE LIB_SDK_${SD_API_VER}_CPP_SRC_FILES "src/${SD_API_VER_L}/sdk/*.cpp")
endforeach(SD_API_VER)

# Set C, CPP and platform source file groups and properties
foreach(SD_API_VER ${SD_API_VERS})
    set(LIB_${SD_API_VER}_C_SRC_FILES ${LIB_BASE_C_SRC_FILES}
                        ${LIB_SDK_${SD_API_VER}_C_SRC_FILES}
                        #${LIB_TRANSPORT_C_SRC_FILES}
    )

    set(LIB_${SD_API_VER}_CPP_SRC_FILES ${LIB_BASE_CPP_SRC_FILES}
                          ${LIB_SDK_${SD_API_VER}_CPP_SRC_FILES}
                          #${LIB_TRANSPORT_CPP_SRC_FILES}
    )
endforeach(SD_API_VER)

set(LIB_PLATFORM_SRC_FILES ${LIB_PLATFORM_C_SRC_FILES} ${LIB_PLATFORM_CPP_SRC_FILES})
#set(CMAKE_EXE_LINKER_FLAGS "--bind")
# Add common compiler definitions
add_definitions(
    -DSD_RPC_EXPORTS
    -DHCI_LINK_CONTROL # Adds support for Link Control packets according to the HCI standard
)
set(ASSERTIONS 2)



# Add libraries
foreach(SD_API_VER ${SD_API_VERS})
    # Object library, from which both shared and static will be built
    add_library(${PC_BLE_DRIVER_${SD_API_VER}_OBJ_LIB} OBJECT ${LIB_${SD_API_VER}_C_SRC_FILES} ${LIB_${SD_API_VER}_CPP_SRC_FILES} ${LIB_PLATFORM_SRC_FILES})

    
    # actual shared and static libraries built from the same object files
    add_library(${PC_BLE_DRIVER_${SD_API_VER}_STATIC_LIB} STATIC $<TARGET_OBJECTS:${PC_BLE_DRIVER_${SD_API_VER}_OBJ_LIB}>)

    #add_executable(out.js ${PC_BLE_DRIVER_${SD_API_VER}_STATIC_LIB})
endforeach(SD_API_VER)



# Set common include directories
include_directories(
        include/common
        include/common/sdk_compat
        include/common/internal
        include/common/internal/transport_interface
)

# Set per-SD API version include directories and compiler definitions
foreach(SD_API_VER ${SD_API_VERS})
    string(TOLOWER ${SD_API_VER} SD_API_VER_L)
    target_include_directories (${PC_BLE_DRIVER_${SD_API_VER}_OBJ_LIB} PRIVATE
        src/${SD_API_VER_L}/sdk/components/libraries/util
        src/${SD_API_VER_L}/sdk/components/serialization/application/codecs/common
        src/${SD_API_VER_L}/sdk/components/serialization/application/codecs/s130/serializers
        src/${SD_API_VER_L}/sdk/components/serialization/application/codecs/s132/serializers
        src/${SD_API_VER_L}/sdk/components/serialization/application/codecs/ble/serializers
        src/${SD_API_VER_L}/sdk/components/serialization/common
        src/${SD_API_VER_L}/sdk/components/serialization/common/struct_ser/s130
        src/${SD_API_VER_L}/sdk/components/serialization/common/struct_ser/s132
        src/${SD_API_VER_L}/sdk/components/serialization/common/struct_ser/ble
        src/${SD_API_VER_L}/sdk/components/softdevice/s132/headers
    )
    # Provide the NRF_SD_BLE_API_VERSION macro to each variant
    string(REGEX MATCH "[0-9]+$" _SD_API_VER_NUM "${SD_API_VER}")
    set(SD_API_VER_COMPILER_DEF_NUM "-D${SD_API_VER_COMPILER_DEF}=${_SD_API_VER_NUM}")
    #${SD_API_VER}
    target_compile_definitions(${PC_BLE_DRIVER_${SD_API_VER}_OBJ_LIB} PRIVATE "${SD_API_VER_COMPILER_DEF_NUM}" NRF_SD_BLE_API=3)
    target_compile_options(${PC_BLE_DRIVER_${SD_API_VER}_OBJ_LIB} PRIVATE "--bind")
    
    
    
    
endforeach(SD_API_VER)
