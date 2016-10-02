'use strict';

const net = require( 'net' );
const Query = require( './query' );
const Response = require( './response' );

const P0F_RESPONSE_SIZE = 232;

class Client {
	constructor( socketPath ) {
		this._socketPath = socketPath;
		this._socket = null;
		this._requestQueue = [];
	}

	connect() {
		return new Promise( ( resolve ) => {
			this._socket = net.connect( { path: this._socketPath }, () => {
				resolve( this );
			} );

			this._socket.on( 'data', this.onDataReceived.bind( this ) );
			this._socket.on( 'end', () => console.log( 'END' ) );
		} );
	}

	query( ipAddress, ipv = 4 ) {
		const query = new Query( ipAddress, ipv );

		this._socket.write( query.serialize() );

		return new Promise( ( resolve ) => {
			this._requestQueue.push( resolve );
		} );
	}

	onDataReceived( data ) {
		const dataLength = data.length;

		if ( dataLength % P0F_RESPONSE_SIZE !== 0 ) {
			throw new Error( 'Invalid data length.' );
		}

		let offset = 0;

		while ( offset < dataLength ) {
			if ( this._requestQueue.length ) {
				const dataSlice = data.slice( offset, offset + P0F_RESPONSE_SIZE );
				const resolve = this._requestQueue.shift();
				resolve( Response.unserialize( dataSlice ) );
			}

			offset += P0F_RESPONSE_SIZE;
		}

	}
}

module.exports = Client;
