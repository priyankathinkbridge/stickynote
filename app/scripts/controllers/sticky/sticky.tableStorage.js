angular.module('Sticky').service('$tcStickyTableStorage', function ($q, $http, stickyConfig) {

	return {
		getNotes   : getNotes,
		setNote    : setNote,
		removeNote : removeNote
	};

	function getNotes() {
		var config = stickyConfig.tableStorage ? stickyConfig.tableStorage.config : {};
		var UTCDate = generateDate();
		var URL = getBaseURL() + '()?$filter=PartitionKey eq \'' + config.partitionKey + '\'';
		var canonicalString = getBaseCanonicalString(UTCDate) + '()';

		var httpConfig = {
			'headers' : angular.extend(getBaseHeader(UTCDate, canonicalString), {
				'Accept' : 'application/json;odata=nometadata'
			})
		};

		return $http.get(encodeURI(URL), angular.extend(getBaseConfig(), httpConfig)).then(onSuccess).catch(onError);

		function onSuccess(response) {
			return response.data.value;
		}

		function onError(error) {
			return $q.reject(error);
		}
	}

	function setNote(note) {
		note.rowKey = note.noteId;
		var config = stickyConfig.tableStorage ? stickyConfig.tableStorage.config : {};
		var UTCDate = generateDate();
		var URL = getBaseURL() + '(PartitionKey=\'' + config.partitionKey + '\',RowKey=\'' + note.rowKey + '\')';
		var canonicalString = getBaseCanonicalString(UTCDate) + '(PartitionKey=\'' + config.partitionKey + '\',RowKey=\'' + note.rowKey + '\')';

		var httpConfig = {
			'headers' : angular.extend(getBaseHeader(UTCDate, canonicalString), {
				'Content-Type' : 'application/json;odata=nometadata'
			})
		};

		return $http.put(encodeURI(URL), note, angular.extend(getBaseConfig(), httpConfig));
	}

	function removeNote(note) {
		note.rowKey = note.noteId;
		var config = stickyConfig.tableStorage ? stickyConfig.tableStorage.config : {};
		var UTCDate = generateDate();
		var URL = getBaseURL() + '(PartitionKey=\'' + config.partitionKey + '\',RowKey=\'' + note.rowKey + '\')';
		var canonicalString = getBaseCanonicalString(UTCDate) + '(PartitionKey=\'' + config.partitionKey + '\',RowKey=\'' + note.rowKey + '\')';

		var httpConfig = {
			'headers' : angular.extend(getBaseHeader(UTCDate, canonicalString), {
				'If-Match' : '*'
			})
		};

		return $http.delete(encodeURI(URL), angular.extend(getBaseConfig(), httpConfig));
	}

	function getBaseURL() {
		var config = stickyConfig.tableStorage ? stickyConfig.tableStorage.config : {};
		return '//' + config.accountName + '.table.core.windows.net/' + config.tableName;
	}

	function getBaseCanonicalString(UTCDate) {
		var config = stickyConfig.tableStorage ? stickyConfig.tableStorage.config : {};
		return UTCDate + '\n/' + config.accountName + '/' + config.tableName;
	}

	function getBaseHeader(UTCDate, canonicalString) {
		var config = stickyConfig.tableStorage ? stickyConfig.tableStorage.config : {};
		return {
			'Authorization' : 'SharedKeyLite ' + config.accountName + ':' + generateSignature(canonicalString),
			'x-ms-date'     : UTCDate,
			'x-ms-version'  : '2015-04-05',
		};
	}

	function getBaseConfig() {
		return {
			disableLoader : true
		};
	}

	function generateSignature(canonicalString) {
		var config = stickyConfig.tableStorage ? stickyConfig.tableStorage.config : {};
		return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(CryptoJS.enc.Utf8.parse(canonicalString), CryptoJS.enc.Base64.parse(config.accountKey)));
	}

	function generateDate() {
		return new Date().toUTCString() || '';
	}

});