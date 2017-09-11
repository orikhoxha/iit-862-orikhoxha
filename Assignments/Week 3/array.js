function max(array){

	if(array.length <= 1){
		return "Array too small";
	}


	//Sort array from the smallest to larget (First time max() time complexity is O(nlogn), other times O(1))
	sort(array);
	return array[array.length  - 1];
}

function largetsThreeNums(array, sorted){

	if(!sorted){
		sort(array);
	}
	return array.slice(array.length - 3);
}


function largestNNums(array,n, sorted){
	if(!sorted){
		sort(array);
	}

	return array.slice(array.length - n);
}



function sort(a){
	sortElements(a,0,a.length - 1);
}



//Sort the elements using the QuickSort implementation
function sortElements(a, lo, hi){

	if(hi <= lo) return false;
	var j = partition(a,lo,hi);
	sortElements(a,lo, j - 1);
	sortElements(a, j + 1, hi);
}


function partition(a, lo, hi){
	var i = lo;
	var j = hi + 1;
	var v = a[lo];

	while(true){

		while(less(a[++i], v)){
			if(i == hi) break;
		}

		while(less(v, a[--j])){
			if(j == lo) break;
		}

		if(i >= j) break;

		swap(a,i,j);
	}

	swap(a, lo, j);
	return j;

}


function less(v, w){
	return v < w;
}


//Swap two elements in position array[a], array[b]
function swap(array,a,b){
	var temp = array[a];
	array[a] = array[b];
	array[b] = temp;
}





var a = [2,1,100,4,5,10,13,22,67,71,99,22,19,63,70,85];



//Get max element from array
console.log(max(a));


//Get three largest elements in array
console.log(largetsThreeNums(a,true));


//Get N(i.e 3, 4 ...) largest elements in array
console.log(largestNNums(a,5,true));

