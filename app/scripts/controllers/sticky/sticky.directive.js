angular.module('Sticky').directive('stickyNote', function () {
	return {
		templateUrl : 'views/stickyNotes.html',
		restrict    : 'E',
		controller  : 'stickyNoteCtrl'
	};
});