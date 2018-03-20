let binding_store = {};



WebusbInterfaceBinding = {
    construct: function(thisPointer){
        binding_store[thisPointer] = new WebusbInterface(thisPointer);
    },
    destruct: function(thisPointer){
        delete binding_store[thisPointer];
    },
    get: function(thisPointer){
        return binding_store[thisPointer];
    }
}

H5TransportBinding = {
    construct: function(thisPointer, nextTransportLayer, retransmission_interval){
        binding_store[thisPointer] = new H5Transport(thisPointer, binding_store[nextTransportLayer], retransmission_interval);
    },
    destruct: function(thisPointer){
        delete binding_store[thisPointer];
    },
    get: function(thisPointer){
        return binding_store[thisPointer];
    }
}

SerializationTransportBinding = {
    construct: function(thisPointer, dataLinkLayer, response_timeout){
        binding_store[thisPointer] = new SerializationTransport(thisPointer, binding_store[dataLinkLayer], response_timeout);
    },
    destruct: function(thisPointer){
        delete binding_store[thisPointer];
    },
    get: function(thisPointer){
        return binding_store[thisPointer];
    }
}

AdapterInternalBinding = {
    construct: function(thisPointer, serializationTransport){
        binding_store[thisPointer] = new AdapterInternal(thisPointer, binding_store[serializationTransport]);
    },
    destruct: function(thisPointer){
        delete binding_store[thisPointer];
    },
    get: function(thisPointer){
        return binding_store[thisPointer];
    }
}
