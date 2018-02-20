const Transport = require('./transport');
const ExitCriterias = require('./h5_transport_exit_criterias')


const h5_state = Object.freeze({
    STATE_START:0,
    STATE_RESET:1,
    STATE_UNINITIALIZED:2,
    STATE_INITIALIZED:3,
    STATE_ACTIVE:4,
    STATE_FAILED:5,
    STATE_UNKNOWN:6
});

class H5Transport extends Transport{
    constructor(nextTransportLayer, retransmission_interval){
        super();
        this.seqNum = 0;
        this.ackNum = 0;
        this.c0Found = false;
        this.unprocessedData = [];
        this.incomingPacketCount = 0;
        this.outGoingPacketCount = 0;
        this.errorPacketCount = 0;
        this.currentState = h5_state.STATE_START;

        this.nextTransportLayer = nextTransportLayer;
        this.retransmission_interval = retransmission_interval;

        this.setupStateMachine();
    }

    open(status_callback, data_callback, log_callback){

    }

    close(){

    }
    send(data){

    }

    dataHandler(data, length){

    }

    statusHandler(code, error){

    }
    processPacket(packet){

    }

    sendControlPacket(type){

    }

    incrementSeqNum(){

    }
    incrementAckNum(){

    }

    setupStateMachine(){
        this.stateActions = {};
        this.exitCriterias = {};

        this.stateActions[h5_state.STATE_START] = function(){
            const exit = this.exitCriterias[h5_state.STATE_START];
            exit.reset();
            this.currentStateAction = function(){
                if(!exit.isFullfilled()){
                    return h5_state.STATE_START;
                }

                if (exit.ioResourceError){
                    return h5_state.STATE_FAILED;
                }

                else if (exit.isOpened){
                    return h5_state.STATE_RESET;
                }

                else{
                    return h5_state.STATE_FAILED;
                }
            }.bind(this);

        }.bind(this);

        this.stateActions[h5_state.STATE_RESET] = function(){

        }.bind(this);

        this.stateActions[h5_state.STATE_UNINITIALIZED] = function(){

        }.bind(this);

        this.stateActions[h5_state.STATE_INITIALIZED] = function(){

        }.bind(this);

        this.stateActions[h5_state.STATE_ACTIVE] = function(){

        }.bind(this);

        this.stateActions[h5_state.STATE_FAILED] = function(){

        }.bind(this);

        this.exitCriterias[h5_state.STATE_START] = new ExitCriterias.StartExitCriterias();
        this.exitCriterias[h5_state.STATE_RESET] = new ExitCriterias.ResetExitCriterias();
        this.exitCriterias[h5_state.STATE_UNINITIALIZED] = new ExitCriterias.UninitializedExitCriterias();
        this.exitCriterias[h5_state.STATE_INITIALIZED] = new ExitCriterias.InitializedExitCriterias();
        this.exitCriterias[h5_state.STATE_ACTIVE] = new ExitCriterias.ActiveExitCriterias();

    }
    startStateMachine(){

    }
    stopStateMachine(){

    }

    stateMachineWorker(){
        
    }

}
module.exports = H5Transport;
