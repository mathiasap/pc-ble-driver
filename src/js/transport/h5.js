const control_pkt_type = Object.freeze({
    CONTROL_PKT_RESET:0,
    CONTROL_PKT_ACK:1,
    CONTROL_PKT_SYNC:2,
    CONTROL_PKT_SYNC_RESPONSE:3,
    CONTROL_PKT_SYNC_CONFIG:4,
    CONTROL_PKT_SYNC_CONFIG_RESPONSE:5
});


const h5_pkt_type_t = Object.freeze({
    ACK_PACKET:0,
    HCI_COMMAND_PACKET:1,
    ACL_DATA_PACKET:2,
    SYNC_DATA_PACKET:3,
    HCI_EVENT_PACKET:4,
    RESET_PACKET:5,
    VENDOR_SPECIFIC_PACKET:14,
    LINK_CONTROL_PACKET:15
});

const seqNumMask = 0x07;
const ackNumMask = 0x07;
const ackNumPos = 3;
const crcPresentMask = 0x01;
const crcPresentPos = 6;
const reliablePacketMask = 0x01;
const reliablePacketPos = 7;

const packetTypeMask = 0x0F;
const payloadLengthFirstNibbleMask = 0x000F;
const payloadLengthSecondNibbleMask = 0x0FF0;
const payloadLengthOffset = 4;

function calculate_header_checksum(header)
{
    let checksum  = header[0];
    checksum += header[1];
    checksum += header[2];
    checksum &= 0xFF;
    checksum  = (~checksum + 1);

    return checksum & 0xff;
}

function calculate_crc16_checksum(out_packet)
{
    let crc = 0xFFFF;

    for(let i = 0; i < out_packet.length; i++){
        const data = out_packet[i];
        crc = (crc >> 8) | (crc << 8);
        crc ^= data;
        crc ^= (crc & 0xFF) >> 4;
        crc ^= crc << 12;
        crc ^= (crc & 0xFF) << 5;
    }
    return crc;
}

function add_crc16(out_packet)
{
    let crc16 = calculate_crc16_checksum(out_packet);
    out_packet.push(crc16 & 0xFF);
    out_packet.push((crc16 >> 8) & 0xFF);
}

function add_h5_header(out_packet, seq_num, ack_num, crc_present, reliable_packet, packet_type, payload_length){
    out_packet.push(
        (seq_num & seqNumMask)
        | ((ack_num & ackNumMask) << ackNumPos)
        | ((crc_present & crcPresentMask) << crcPresentPos)
        | ((reliable_packet & reliablePacketMask) << reliablePacketPos));

    out_packet.push(
        (packet_type & packetTypeMask)
        | ((payload_length & payloadLengthFirstNibbleMask) << payloadLengthOffset));

    out_packet.push((payload_length & payloadLengthSecondNibbleMask) >> payloadLengthOffset);
    out_packet.push(calculate_header_checksum(out_packet));
}



function h5_encode(in_packet, out_packet, seq_num, ack_num, crc_present, reliable_packet, packet_type){
    add_h5_header(out_packet, seq_num, ack_num, crc_present, reliable_packet, packet_type, in_packet.length);

    for(let i = 0; i < in_packet.length; i++){
        out_packet.push(in_packet[i]);
    }

    // Add CRC
    if (crc_present){
        add_crc16(out_packet);
    }
}
