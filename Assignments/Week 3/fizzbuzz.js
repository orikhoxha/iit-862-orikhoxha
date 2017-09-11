function fizzBuzz(start, end){
	if( start > end){
		throw "Start must be smaller than end";
	} 

	for(var i = start; i <= end; i++){
		var message = "";

		if( i % 3 === 0){
			message += "Fizz";
		}

		if(i % 5 === 0){
			message += "Buzz";
		}

		console.log(message || i);

	}
}

