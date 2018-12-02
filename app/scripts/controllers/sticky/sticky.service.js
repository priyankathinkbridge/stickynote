angular.module('Sticky').service('$tcSticky', function ($q, stickyConfig, $tcStickyLocalStorage, $tcStickyTableStorage) {
	var tableStorageEnabled = stickyConfig.tableStorage && stickyConfig.tableStorage.enabled;

	return {
		getNotes   : getNotes,
		setNote    : setNote,
		removeNote : removeNote
	};

	function getNotes() {
		if(!tableStorageEnabled)
			{return $tcStickyLocalStorage.getNotes();}

		else
			{return $tcStickyTableStorage.getNotes().then(onSuccess).catch(onError);}

		function onSuccess(notes) {
			return $tcStickyLocalStorage.setNotes(notes).then(onInnerSuccess).catch(onError);

			function onInnerSuccess() {
				return notes;
			}
		}

		function onError(error) {
			return $q.reject(error);
		}
	}

	function setNote(note) {
		var onLocal;
		var onTable;
		var deferred = $q.defer();
		var promises = [$tcStickyLocalStorage.setNote(note).then(function(data){
			 onLocal=true;
			deferred.resolve(data); return onLocal}).catch(function(error){
				 onLocal=false;
				return onLocal;
			})];
		tableStorageEnabled && promises.push($tcStickyTableStorage.setNote(note)
		.then(function(data){
			onTable=true;
			return onTable;
			deferred.resolve(data);
		}).catch(function(){
			 onTable=false;
			return onTable;
		}));
		return $q.all(promises);
	}
	function removeNote(note) {
		var promises = [$tcStickyLocalStorage.removeNote(note)];
		tableStorageEnabled && promises.push($tcStickyTableStorage.removeNote(note));
		return $q.all(promises);
	}
});