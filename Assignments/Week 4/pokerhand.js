var handAssessor = function(cardsArray){


	var ranks = [ {"rank" : "two", "position" : 2},
				  {"rank" : "three", "position" : 3},
				  {"rank" : "four", "position" : 4},
				  {"rank" : "five", "position" : 5},
				  {"rank" : "six", "position" : 6},
				  {"rank" : "seven", "position" : 7},
				  {"rank" : "eight", "position" : 8},
				  {"rank" : "nine", "position" : 9},
				  {"rank" : "ten", "position" : 10},
				  {"rank" : "jack", "position" : 11},
				  {"rank" : "queen", "position" : 12},
				  {"rank" : "king", "position" : 13},
				  {"rank" : "ace", "position" : 14}
	];


	//Message printed with possible hands
	var message = "";

	/******* Helper Functions ******/
	var sortPositions = function(array){
		array.sort(function(a,b){
			return a - b;
		});
		return array;
	}

	//Find lowest card in hand
	var lowest = function(cardsArray){
		var positions = findAndSortPositions(cardsArray);
		return positions[0];
	}


	//Find highest card in hand
	var highest = function(cardsArray){
		var positions = findAndSortPositions(cardsArray);
		return positions[positions.length - 1];
	}

	//Sort card positions from lowest to highest
	var findAndSortPositions = function(cardsArray){
		var rankHandPositions = [];
		ranks.forEach(function(rank){
			cardsArray.forEach(function(card){
				if(rank.rank === card.rank){
					rankHandPositions.push(rank.position);
				}
			});
		});
		return sortPositions(rankHandPositions);
	}
	/******* Helper Functions ******/


	//Get rank from the hand
	var handRanks = cardsArray.map(function(card){
		return card.rank;
	});	

	//Get suits from the rank
	var handSuits = cardsArray.map(function(card){
		return card.suit;
	});

	//Count rank occurence in a hand
	var containsNTimes = function(cardsArray){
		var ranksFoundOccurence = [];

		cardsArray.forEach(function(rank){
			var count = 0;
			handRanks.forEach(function(handRank){
				if(rank.rank === handRank){
					count++;
				}
			});

			if(count > 1){
				var rankPushed = ranksFoundOccurence.some(function(elem){
					return elem.rank == rank.rank ? true : false;
				});
				if(!rankPushed){
					ranksFoundOccurence.push({rank : rank.rank, occurence : count});
				}
			}
		});
		return ranksFoundOccurence;
	}


	var containsPair = function(hand){
		var result = containsNTimes(hand);
		var ret = false;
		result.forEach(function(rank){
			if(rank.occurence === 2){
				ret =  true;
			}
		});
		return ret;
	}

	var twoOfPair = function(hand){
		var result = containsNTimes(hand);
		if(result.length === 2){
			return true;
		}
		return false;
	}

	var containsThreeOfAKind = function(hand){
		var result = containsNTimes(hand);
		var ret = false;
		result.forEach(function(rank){
			if(rank.occurence === 3){
				ret = true;
			}
		});
		return ret;
	}

	var straight = function(cardsArray){
		if(!containsPair(cardsArray) && ((highest(cardsArray) - lowest(cardsArray)) === 4)){
			return true;
		}
		return false;
	}

	var flush = function(cardsArray){
		for(var i = handSuits.length - 1; i > 0; i--){
			if(handSuits[i] !== handSuits[i - 1]){
				return false;
			}
		}
		return true;
	}

	var fullHouse = function(cardsArray){
		var result = containsNTimes(cardsArray);
		if(containsPair(cardsArray) && containsThreeOfAKind(cardsArray)){
			return true;
		}
		return false;
	}

	var containsFourOfAKind = function(hand){
		var result = containsNTimes(hand);
		var ret = false;
		result.forEach(function(rank){
			if(rank.occurence >= 4){
				ret = true;
			}
		});
		return ret;
	}

	var straightFlush = function(hand){
		var sameSuits = true;
		var k = 0;
		for(var i = 1 ; i < handSuits.length;i++){
			if(handSuits[k] !== handSuits[i]){
				sameSuits = false;
			}
		}
		if(sameSuits && straight(hand)){
			return true;
		}
		return false;
	}

	var royalFlush = function(hand){
		if(straightFlush(hand) && lowest(hand) === 10 && highest(hand) === 14){
			return true;
		}
		return false;
	}


	var matchingHands = function(cardsArray){

		if(royalFlush(cardsArray)){
			message += "royal flush, ";
		}

		if(straightFlush(cardsArray)){
			message += "straight flush, ";
		}

		if(containsFourOfAKind(cardsArray)){
			message += "four of a kind, ";
		}

		if(fullHouse(cardsArray)){
			message += "full house, ";
		}

		if(flush(cardsArray)){
			message += "flush, ";
		}

		if(straight(cardsArray)){
			message += "straight, ";
		}

		if(containsThreeOfAKind(cardsArray)){
			message += "three of a kind, ";
		}

		if(twoOfPair(cardsArray)){
			message += "two of a pair, ";
		}

		if(containsPair(cardsArray)){
			message += "pair";
		}
		return message === "" ? "Bust" : message;
	}

	return matchingHands(cardsArray);

}

var hand = [
		{ "rank":"ten", "suit":"clubs"},
		{ "rank":"jack", "suit":"clubs"},
		{ "rank":"queen", "suit":"clubs"},
		{ "rank":"king", "suit":"clubs"},
		{ "rank":"ace", "suit":"clubs"}
];


$(document).ready(console.log(handAssessor(hand)));

