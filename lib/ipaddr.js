'use strict';

const { Address6 } = require( 'ip-address' );
const { Address4 } = require( 'ip-address' );

module.exports = {
	parseIPv4( ipv4Address ) {
		const address = new Address4( ipv4Address );

		if ( !address.isValid() ) {
			throw new Error( 'Invalid IPv4 address' );
		}

		return address.toArray();
	},

	parseIPv6( ipv6Address ) {
		const address = new Address6( ipv6Address );

		if ( !address.isValid() ) {
			throw new Error( 'Invalid IPv6 address' );
		}

		return address.toUnsignedByteArray();
	}
};
