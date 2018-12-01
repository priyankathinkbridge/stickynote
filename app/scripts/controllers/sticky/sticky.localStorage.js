angular.module('Sticky').service('$tcStickyLocalStorage', function ($q, stickyConfig) {

	var storageKey = stickyConfig.localStorageKey || 'stickyArray';

	return {
		getNotes   : getNotes,
		setNotes   : setNotes,
		setNote    : setNote,
		removeNote : removeNote
	};

	function getNotes() {
		return $q.resolve(getItem());
	}
	var promise = $q(function(resolve, reject) {
		if (work === "resolve") {
			resolve('response 1!');
		} else {
			reject('Oops... something went wrong');
		}
	  }); 
	  promise.then(function(data) {
		alert(data)  
	
	  }) 
	function setNotes(notes) {
		return $q.resolve(setItem(notes));
	}

	function setNote(note) {
		var notes = getItem();
		var index = notes.findIndex(getNoteIndex);

		if(~index)
			{notes[index] = note;}

		else
			{notes = notes.concat(note);}

		return setNotes(notes);

		function getNoteIndex(arrayNote) {
			return arrayNote.noteId == note.noteId;
		}
	}

	function removeNote(note) {
		var notes = getItem();
		notes = notes.filter(filterNote);
		return $q.resolve(setItem(notes));

		function filterNote(arrayNote) {
			return arrayNote.noteId != note.noteId;
		}
	}

	function setItem(item) {
		return localStorage.setItem(storageKey, JSON.stringify(item));
	}

	function getItem() {
		return JSON.parse(localStorage.getItem(storageKey))||[];
	}
});