angular.module('Sticky').controller('stickyNoteCtrl', function ($scope, $timeout, $interval, $tcSticky) {
	$scope.isEdit = false;
	$scope.status=[];
	$scope.NotesData = [];
	$scope.noteInEdit = {};
	$scope.showUpButton = false;
	$scope.showDownButton = false;
	$scope.toggleNotes = toggleNotes;
	$scope.noteVisible = localStorage.getItem('noteVisible') == 'true';
	toggleNotes(!$scope.noteVisible);

	var addNoteModal = $('sticky-note #add-note-modal');
	var notesWrapper = $('sticky-note #notes-wrapper');
	var temp, scrolling, scrollVar;

	$scope.$watch('NotesData', function (n) {
		n.length && $timeout(buttonShowHide, 1000);
	}, true);

	$scope.deleteNote = function (note) {
		$tcSticky.removeNote(note).then(function () {
			$scope.NotesData = $scope.NotesData.filter(filterNote);
		});

		function filterNote(arrayNote) {
			return arrayNote.noteId != note.noteId;
		}
	};

	$scope.setColor = function (color) {
		$('sticky-note .color-option').removeClass('active');
		$('sticky-note .color-option.' + color).addClass('active');
		$scope.noteInEdit.color = color;
	};

	$scope.setAddMode = function () {
		$scope.noteInEdit = {};
		$scope.setColor('yellow');
		$scope.isEdit = false;
	};

	$scope.setEditMode = function (note) {
		temp = note;
		angular.copy(note, $scope.noteInEdit);
		$scope.setColor(note.color);
		$scope.isEdit = true;
	};

	$scope.saveNote = function () {
		if ($scope.isEdit) {
			angular.extend(temp, $scope.noteInEdit);
		}

		else {
			$scope.noteInEdit.date = new Date();
			$scope.noteInEdit.isShow = false;
			$scope.noteInEdit.color = $scope.noteInEdit.color || 'yellow';
			$scope.noteInEdit.noteId = 'note' + Math.random() + Date.now();
		}

		$tcSticky.setNote($scope.noteInEdit).then(function (status) {
			$scope.status=status;
			var index = $scope.NotesData.findIndex(getNoteIndex);
			$scope.tmpid=$scope.noteInEdit.noteId;
			if (~index)
				{$scope.NotesData[index] = $scope.noteInEdit;}

			else
				{$scope.NotesData = $scope.NotesData.concat($scope.noteInEdit);}
			function getNoteIndex(arrayNote) {
				return arrayNote.noteId == $scope.noteInEdit.noteId;
			}

			addNoteModal.modal('hide');
			$scope.noteInEdit = {};
		}).catch()
	};
	$scope.myfuntion=function(note){
		//console.log("dsjhkjhjkdfs");
	}
	function toggleNotes(bool) {
		if(angular.isDefined(bool))
			$('sticky-note').toggleClass('collapsed', bool);

		else {
			$('sticky-note').toggleClass('collapsed');
			$scope.noteVisible = !$scope.noteVisible;
		}

		localStorage.setItem('noteVisible', $scope.noteVisible);

		if ($scope.noteVisible) {
			$('sticky-note #toggle-notes .fa').removeClass('fa-chevron-up').addClass('fa-chevron-down');
		}

		else {
			$('sticky-note #toggle-notes .fa').removeClass('fa-chevron-down').addClass('fa-chevron-up');
			$('sticky-note .note').removeClass('expanded');

			$scope.NotesData.length && $scope.NotesData.forEach(function (value) {
				value.isShow = false;
			});
		}
	}

	var buttonShowHide = function (scrollVar) {
		scrollVar = scrollVar || notesWrapper.scrollTop();
		$scope.showUpButton = true;
		$scope.showDownButton = true;

		if (notesWrapper[0].scrollHeight <= notesWrapper.height()) {
			$scope.showUpButton = false;
			$scope.showDownButton = false;
		}

		if (scrollVar <= 0) {
			$scope.showUpButton = false;
			scrolling && $interval.cancel(scrolling);
		}

		if (scrollVar >= (notesWrapper[0].scrollHeight - notesWrapper.height())) {
			$scope.showDownButton = false;
			scrolling && $interval.cancel(scrolling);
		}
	};
	$scope.reSink=function(note){
		
	}
	$scope.toggleNote = function (note) {
		console.log(note.noteId);
		if(note.noteId==$scope.tmpid){
			$scope.onLocal=$scope.status[0];
					if($scope.status[1]==true){
						$scope.onTable=true;
						$scope.notonTable=false;}
					else{
						$scope.notonTable=true;
						$scope.onTable=false;}					
		}
		else{
			$scope.onTable=false;
			$scope.onLocal=false;
			$scope.notonTable=false;
		}
		note.isShow = !note.isShow;
	};

	$scope.scroll = function (delta, direction) {
		scrollVar = notesWrapper.scrollTop();
		scrollVar = direction ? scrollVar + delta : scrollVar - delta;
		notesWrapper.scrollTop(scrollVar);
		buttonShowHide(scrollVar);
	};

	$scope.startScroll = function (direction) {
		scrolling = $interval(function () {
			$scope.scroll(1, direction);
		}, 10);
	};

	$scope.stopScroll = function () {
		$interval.cancel(scrolling);
	};

	function getData() {
		$tcSticky.getNotes()
			.then(function (data) {
				$scope.NotesData = data;
				$scope.noteVisible = !$('sticky-note').hasClass('collapsed');
				$scope.NotesData.length && $scope.NotesData.forEach(function (value) {
					value.isShow = false;
					
				});
			});
	}

	getData();

});