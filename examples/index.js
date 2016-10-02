'use strict';

const P0FClient = require( './../' );

const client = new P0FClient( '/tmp/p0f-socket' );

client.connect().then( () => {
	try {
		client.query( '212.77.98.9' ).then( ( data ) => console.log( data ) );
	} catch ( err ) {
		console.log( err );
	}
} );
