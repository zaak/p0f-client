'use strict';

const IPAddr = require( './ipaddr' );

const P0F_QUERY_MAGIC = 0x50304601;

class Query {
	constructor( ipAddress, ipv = 4 ) {
		this.ipAddress = ipAddress;
		this.ipv = ipv;
	}

	serialize() {
		const buffer = Buffer.alloc( 21, 0 );
		buffer.writeUInt32LE( P0F_QUERY_MAGIC, 0 );
		buffer.writeUInt8( this.ipv, 4 );

		const parsedIp = IPAddr.parseIPv4( this.ipAddress );

		let buffWriteOffset = 5;

		parsedIp.forEach( ( byte ) => {
			buffer.writeUInt8( byte, buffWriteOffset++ );
		} );

		return buffer;
	}
}

module.exports = Query;
