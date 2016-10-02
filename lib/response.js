'use strict';

const P0F_RESPONSE_MAGIC = 0x50304602;

const statusMap = new Map()
	.set( 0x00, 'BAD QUERY' )
	.set( 0x10, 'OK' )
	.set( 0x20, 'NO MATCH' );

function parseString( stringBuffer ) {
	let parsedString = stringBuffer.toString();
	parsedString = parsedString.substr( 0, parsedString.indexOf( "\0" ) );

	return parsedString || null;
}

module.exports = {
	/**
	 * @param {Buffer} data
	 */
	unserialize: ( data ) => {
		const result = {};

		let offset = 0;

		const magic = data.readUInt32LE( offset );
		offset += 4;

		if ( magic !== P0F_RESPONSE_MAGIC ) {
			throw new Error( 'Invalid response magic.' );
		}

		const status = data.readUInt32LE( offset );
		offset += 4;

		if ( statusMap.has( status ) ) {
			result.status = statusMap.get( status );
		} else {
			result.status = undefined;
		}

		if ( status !== 0x10 ) { // If status is not OK stop here.
			return result;
		}

		result.firstSeen = new Date( data.readUInt32LE( offset ) * 1000 );
		offset += 4;

		result.lastSeen = new Date( data.readUInt32LE( offset ) * 1000 );
		offset += 4;

		result.totalConn = data.readUInt32LE( offset );
		offset += 4;

		const uptimeMin = data.readUInt32LE( offset );
		offset += 4;
		result.uptimeMin = uptimeMin || null;

		result.upModDays = data.readUInt32LE( offset );
		offset += 4;

		const lastNat = data.readUInt32LE( offset );
		offset += 4;
		result.lastNat = lastNat ? new Date( lastNat * 1000 ) : null;


		const lastChg = data.readUInt32LE( offset );
		offset += 4;
		result.lastChg = lastChg ? new Date( lastChg * 1000 ) : null;

		const distance = data.readUInt16LE( offset );
		offset += 2;
		result.distance = distance === -1 ? null : distance;

		result.badSW = data.readUInt8( offset );
		offset += 1;

		result.osMatchQ = data.readUInt8( offset );
		offset += 1;

		result.osName = parseString( data.slice( offset, offset + 32 ) );
		offset += 32;

		result.osFlavor = parseString( data.slice( offset, offset + 32 ) );
		offset += 32;

		result.httpName = parseString( data.slice( offset, offset + 32 ) );
		offset += 32;

		result.httpFlavor = parseString( data.slice( offset, offset + 32 ) );
		offset += 32;

		result.linkType = parseString( data.slice( offset, offset + 32 ) );
		offset += 32;

		result.language = parseString( data.slice( offset, offset + 32 ) );
		offset += 32;

		return result;
	}
};
