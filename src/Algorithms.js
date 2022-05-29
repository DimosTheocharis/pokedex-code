export const binarySearch = (myArray, left, right, key, fullWord) => {
    if (left <= right) {
        const middle = left + Math.floor((right - left) / 2);; //find the index of the middle element in the list
        
        let i, prefix = "", current; //the prefix of the pokemon name at the middle of the given array
        if (fullWord) {
            current = myArray[middle].name;
        } else {
            for (i = 0; i < key.length; i++) {
                prefix += myArray[middle].name[i];
            }
            current = prefix;
        }
        
        if (current === key) { //if the key is present at the middle
            return middle;
        } else if (key < current) { //if the key is smaller tham the middle, repeat the proccess for the first half of the given myArray
            return binarySearch(myArray, left, middle - 1, key, fullWord);
        } else { //if the key is smaller tham the middle, repeat the proccess for the first half of the given myArray
            return binarySearch(myArray, middle + 1, right, key, fullWord);
        }
    } else {
        return -1;
    }
}



export const mergeSort = (myArray) => {
    if (myArray.length > 1) {
        let i,j,k;
        
        let middle = parseInt(myArray.length / 2); //get the middle of the array

        let leftArray = [];
        for (i = 0; i < middle; i++) {
            leftArray.push(myArray[i]); //get the first half of the given array
        }

        let rightArray = [];
        for (i = middle; i < myArray.length; i++) {
            rightArray.push(myArray[i]); // get the second half of the given array
        }

        mergeSort(leftArray); //repeat the proccess for the leftArray
        mergeSort(rightArray); //repeat the proccess for the rightArray
        
        //merge the 2 arrays back to the original array
        i = j = k = 0;
        while (i < leftArray.length && j < rightArray.length) {
            if (leftArray[i].name < rightArray[j].name) {
                myArray[k] = leftArray[i];
                i += 1;
            } else {
                myArray[k] = rightArray[j];
                j += 1;

            }
            k += 1;
        }

        //check if any elements of the leftArray are left
        while (i < leftArray.length) {
            myArray[k] = leftArray[i];
            k += 1;
            i += 1;
        }

        //check if any elements of the rightArray are left
        while (j < rightArray.length) {
            myArray[k] = rightArray[j];
            k += 1;
            j += 1;
        }
    } 

    return myArray;
}