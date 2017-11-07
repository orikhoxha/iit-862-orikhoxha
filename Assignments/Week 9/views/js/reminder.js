var $remindersTable = $("#remindersTable tbody");

$("[data-toggle=tooltip]").tooltip();


function buildItemEl(reminder) {
	
    var $tdTitle = $("<td>");
    $tdTitle.append(reminder.title);

    var $tdDescription = $("<td>");
    $tdDescription.append(reminder.description);


    var $tdDate = $("<td>");
    $tdDate.append(reminder.created);
    
    var reminderId = reminder._id;

    var userId = reminder.owner;
   
    var $editCol = $('<td></td>');
    var $editButtonWrapper = $('<p data-placement="top" data-toggle="tooltip" title="Edit"></p>')
	var $editButton = $('<button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal"  data-target="#edit" ><span class="glyphicon glyphicon-pencil"></span></button>');

	$editButton.click(function(){
		loadReminder(userId,reminderId);
	});

	$editButtonWrapper.append($editButton);
	$editCol.append($editButtonWrapper);
	
	var $deleteCol = $('<td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal"  data-target="#delete" ><span class="glyphicon glyphicon-trash"></span></button></p></td>');
	$deleteCol.find('button').click(function(){
		confirmDelete(userId,reminderId);
	});

	var $row = $("<tr>");
	$row.append($tdTitle);
	$row.append($tdDescription);
	$row.append($tdDate);
	$row.append($editCol);
	$row.append($deleteCol);

    return $row;
}
function loadData(userId){

	$.ajax({
		url:"/users/" + userId +"/reminders",
		type: "GET",
		success: function(reminders,status){
			console.log(reminders);
			for(var i = 0; i <  reminders.length;i++){
				$remindersTable.append(buildItemEl(reminders[i]));
			}
		}
	});
}

$('#add-reminder-btn').click(function(e){

		var $title = $("#title-input").val();
		var $description = $("#description-input").val();
		var $userId = $("#userId").val();

		var reminder = {
			"reminder":{
				title: $title,
				description: $description	
			}
			
		}
		console.log(JSON.stringify(reminder));
		$.ajax({
			url: "/users/" + $userId + "/reminders",
			type: "POST",
			data: JSON.stringify(reminder),
			contentType: "application/json",
			success: function(newUser,status){
				console.log(newUser);
				$remindersTable.append(buildItemEl(newUser));
			}
		});
});



function loadReminder(userId,reminderId){

	$.ajax({
		url: "/users/" + userId + "/reminders/" + reminderId,
		type: "GET",
		success: function(reminder,status){
			console.log(reminder);
			$("#input-title").val(reminder.title);
			$("#input-description").val(reminder.description);
			$('#btn-edit-reminder').click(function(){
				var updatedReminder = {
					title: $("#input-title").val(),
					description: $("#input-description").val()
				};
				updateReminder(userId,reminderId,updatedReminder);
				console.log(updatedReminder);
			});
		}
	});
}

function updateReminder(userId,reminderId,updatedReminder){
	$.ajax({
		url: "/users/" + userId + "/reminders/" + reminderId,
		type: "PUT",
		data: JSON.stringify(updatedReminder),
		contentType: "application/json",
		success: function(u,status){
			removeModal();
			loadData(userId);

		}
	});
}

function loadData(userId){
	$.ajax({
		url: "/users/" + userId + "/reminderlist",
		type: "GET",
		success: function(reminders,status){
			$remindersTable.empty();
			console.log(reminders.length);
			for(var i = 0; i < reminders.length;i++){
				$remindersTable.append(buildItemEl(reminders[i]));
			}
		}
	});
}


function confirmDelete(userId,reminderId) {
	console.log(reminderId);
		$("#btn-yes-remove").click(function(){
			deleteReminder(userId,reminderId);
			loadData();
		});
}

function deleteReminder(userId,reminderId){
	$.ajax({
	url: "/users/" + userId + "/reminders/" + reminderId,
	type: "DELETE",
	contentType: "application/json",
	success: function(u,status){
		removeModal();
		loadData(userId);
	}
	});
}

function deleteAll(userId,reminderId){
	$.ajax({
	url: "/users/" + userId + "/reminders/",
	type: "DELETE",
	contentType: "application/json",
	success: function(u,status){
		loadData(userId);
	}
	});
}

function removeModal(){
		$('.modal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
}
