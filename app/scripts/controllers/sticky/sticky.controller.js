angular.module('Sticky').controller('stickyNoteCtrl', function ($scope, $timeout, $interval, $tcSticky) {
	$scope.isEdit = false;
//	$scope.status=[];
	$scope.NotesData = [];
	$scope.notesId=[];
	$scope.notesTableId=[];
	$scope.notesnotTableId=[];
	$scope.noteInEdit = {};
	$scope.showUpButton = false;
	$scope.showDownButton = false;
	$scope.toggleNotes = toggleNotes;
	$scope.noteVisible = localStorage.getItem('noteVisible') == 'true';
	toggleNotes(!$scope.noteVisible);

	var addNoteModal = $('sticky-note #add-note-modal');
	var notesWrapper = $('sticky-note #notes-wrapper');
	var temp, scrolling, scrollVar;
	var i=0;
	var k=0;

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
			//$scope.notesId[i]=$scope.noteInEdit.noteId;
			//i++;
		}
		$tcSticky.setNote($scope.noteInEdit).then(function (status) {
			//$scope.status=status;
			$scope.onLocal=status[0];
			var index = $scope.NotesData.findIndex(getNoteIndex);
			if(status[1]==true){
				$scope.notesTableId[i]=$scope.noteInEdit.noteId;
				i++;
			}
			else{
				$scope.notesnotTableId[k]=$scope.noteInEdit.noteId;
				k++;
			}
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
		//console.log(note.noteId);
		
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
		note.isShow = !note.isShow;
		$tcSticky.setNote($scope.noteInEdit).then(function (status) {
			$scope.onLocal=status[0];
			if(status[1]==true){
				var itemindex=$scope.notesnotTableId.indexOf(note.noteId);
				delete $scope.notesnotTableId[itemindex];
				$scope.notesTableId.push(note.noteId);
			}
			else{
			}
		}).catch()
	}
	$scope.toggleNote=function(note){
		var j;
		for(j=0;j<$scope.notesTableId.length;j++){
			if(note.noteId==$scope.notesTableId[j]){
				$scope.onTable=true;
				$scope.notonTable=false;
				break;
			}
		}
		for(j=0;j<$scope.notesnotTableId.length;j++){
			if(note.noteId==$scope.notesnotTableId[j]){
				$scope.onTable=false;
				$scope.notonTable=true;
			}
		}
		note.isShow = !note.isShow;
	}
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