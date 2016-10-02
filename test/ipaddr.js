'use strict';

const mocha = require( 'mocha' );
const describe = mocha.describe;
const it = mocha.it;
const IPAddr = require( './../lib/ipaddr' );
const assert = require( 'assert' );

describe( 'IP address parser', () => {
	it( 'should properly parse IPv4 addresses', () => {
		assert.deepStrictEqual( [ 127, 0, 0, 1 ], IPAddr.parseIPv4( '127.0.0.1' ) );
		assert.deepStrictEqual( [ 8, 8, 8, 8 ], IPAddr.parseIPv4( '8.8.8.8' ) );
	} );

	it( 'should throw if invalid IP v4 addresses was passed', () => {
		const expectedError = /Invalid IPv4 address/;
		assert.throws( () => IPAddr.parseIPv4( '127.0.0.n' ), expectedError );
		assert.throws( () => IPAddr.parseIPv4( '127.0.0,0' ), expectedError );
		assert.throws( () => IPAddr.parseIPv4( '' ), expectedError );
	} );

	it( 'should properly parse IPv6 addresses', () => {
		assert.deepStrictEqual(
			[ 32, 1, 13, 184, 133, 163, 8, 211, 19, 25, 138, 46, 3, 112, 115, 72 ],
			IPAddr.parseIPv6( '2001:db8:85a3:8d3:1319:8a2e:370:7348' )
		);
	} );

	it( 'should throw if invalid IP v6 addresses was passed', () => {
		const expectedError = /Invalid IPv6 address/;
		assert.throws( () => IPAddr.parseIPv6( 'fdda:5cc1:23:4::1f:' ), expectedError );
		assert.throws( () => IPAddr.parseIPv6( 'fd::da:5cc1:23:4::1f' ), expectedError );
		assert.throws( () => IPAddr.parseIPv6( '' ), expectedError );
	} );
} );
