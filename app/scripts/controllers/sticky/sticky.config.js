angular.module('Sticky').constant('stickyConfig', {
	tableStorage : {
		enabled : true,
		config  : {
			accountName  : 'tcbizsparkstorage',
			accountKey   : 'ERj8u0XjOI1qw0XsLboV4qrhRs8rYPIAU4KvHXfpvKGCe082tXcqEhvdBzcYyoLBhsBe07oKL++3z1icDHui8g==',
			tableName    : 'stickynotes',
			partitionKey : 'DemoUser'
		}
	},
	localStorageKey : 'stickyArray'
});