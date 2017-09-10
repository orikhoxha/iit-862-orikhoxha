//Hide elements
$(".relevant").children().hide();

//Fade in elements after page loads
$(document).ready(function(){

	var colors  = [];


	//Generate random colors
	function generateColor(){
		return "#" + Math.random().toString(16).substr(-6);
	}

	var childrenLength = $(".relevant").children().length;

	for(var i = 0; i < childrenLength; i++){
		colors.push(generateColor());
	}

	$(".relevant").children().each(function(i){

		$(this).css('color',colors[i++]);

	}).fadeIn(1000);

});