var $usersTable = $("#usersTable tbody");

$("[data-toggle=tooltip]").tooltip();


function buildItemEl(user) {
	
    var $tdName = $("<td>");
    $tdName.append(user.name);

    var $tdEmail = $("<td>");
    $tdEmail.append(user.email);
    
    var id = user._id;
    var $tdReminderList = $('<td><a href="/users/' + id +'/reminders">List</a></td>');

    var $editCol = $('<td></td>');
    var $editButtonWrapper = $('<p data-placement="top" data-toggle="tooltip" title="Edit"></p>')
	var $editButton = $('<button class="btn btn-primary btn-xs" data-title="Edit" data-toggle="modal"  data-target="#edit" ><span class="glyphicon glyphicon-pencil"></span></button>');

	$editButton.click(function(){
		loadUser(id);
	});

	$editButtonWrapper.append($editButton);
	$editCol.append($editButtonWrapper);
	
	var $deleteCol = $('<td><p data-placement="top" data-toggle="tooltip" title="Delete"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal"  data-target="#delete" ><span class="glyphicon glyphicon-trash"></span></button></p></td>');
	$deleteCol.find('button').click(function(){
		confirmDelete(id);
	});

	var $row = $("<tr>");
	$row.append($tdName);
	$row.append($tdEmail);
	$row.append($tdReminderList);
	$row.append($editCol);
	$row.append($deleteCol);

    return $row;
}
function loadData(){

	$.ajax({
		url:"/users/",
		type: "GET",
		success: function(users,status){
			console.log(users);
			for(var i = 0; i <  users.length;i++){
				$usersTable.append(buildItemEl(users[i]));
			}
		}
	});
}

$('#add-user-btn').click(function(e){

		var name = $("#name-input").val();
		var email = $("#email-input").val();

		var user = {
			"user":{
				name: name,
				email: email	
			}
			
		}
		console.log(JSON.stringify(user));
		$.ajax({
			url: "/users/",
			type: "POST",
			data: JSON.stringify(user),
			contentType: "application/json",
			success: function(newUser,status){
				console.log(newUser);
				$usersTable.append(buildItemEl(newUser));
			}
		});
});



function loadUser(userId){

	$.ajax({
		url: "/users/" + userId,
		type: "GET",
		success: function(user,status){
			console.log(user);
			$("#input-name").val(user.name);
			$("#input-email").val(user.email);
			$('#btn-edit-user').click(function(){
				var updatedUser = {
					name: $("#input-name").val(),
					email: $("#input-email").val()
				};
				updateUser(userId,updatedUser);
			});
		}
	});
}

function updateUser(userId,updatedUser){
	$.ajax({
		url: "/users/" + userId,
		type: "PUT",
		data: JSON.stringify(updatedUser),
		contentType: "application/json",
		success: function(u,status){
			removeModal();
			loadData();

		}
	});
}

function loadData(){
	$.ajax({
		url: "/users",
		type: "GET",
		success: function(users,status){
			$usersTable.empty();
			console.log(users.length);
			for(var i = 0; i < users.length;i++){
				$usersTable.append(buildItemEl(users[i]));
			}
		}
	});
}


function confirmDelete(userId) {
		$("#btn-yes-remove").click(function(){
			deleteUser(userId);
			loadData();
		});
	}

	function deleteUser(userId){
		$.ajax({
		url: "/users/" + userId,
		type: "DELETE",
		contentType: "application/json",
		success: function(u,status){
			removeModal();
			loadData();

		}
	});
}

function removeModal(){
		$('.modal').modal('hide');
		$('body').removeClass('modal-open');
		$('.modal-backdrop').remove();
}
