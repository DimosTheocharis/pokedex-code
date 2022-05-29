import React, { useContext, useState, useRef } from 'react';
import SearchBarCSS from './SearchBar.module.css'
import { AppContext } from '../../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { binarySearch, mergeSort } from '../../Algorithms';

const prefixLength = 3 //the total lettes that are needed in order for a search to begin

function SearchBar() {
    const { pokemonDataByName, setSelectedPokemonData, setTriadPokemon } = useContext(AppContext);
    const [results, setResults] = useState([]);
    const clearButtonRef = useRef(); //creating a reference object for the clear button, to manipulate its value
    const navigate = useNavigate(); //a history object to navigate through
    

    const handleChange = (e) => {
        if (e.target.value.length >= prefixLength) {
            let i, j, pos, res, stop, prefix;
            //goal is to take the value of the input as prefix, and find all pokemon names, starting with this.
            //binary search will find the position of only one such pokemon name, so it is needed to take all pokemon names starting
            //with prefix, at the right and at the left side of the found position
            pos = binarySearch(pokemonDataByName, 0, pokemonDataByName.length - 1, e.target.value.toLowerCase(), false);

            if (pos !== -1) {
                stop = false//when we reach a pokemon that has not as its prefix the value of the input, then stop will be true
                
                res = [] //an array with all pokemon names that begin with the value of the input
                res.push(pokemonDataByName[pos].name) //append the name that you found at the results

                i = pos + 1;
                while (i < pokemonDataByName.length && stop === false) {
                    prefix = "" //the prefix of the pokemon name 
                    
                    //searching right for names that start with the value of input
                    for (j = 0; j < e.target.value.length; j++) { //find the prefix of the pokemon name at the position i
                        prefix += pokemonDataByName[i].name[j];
                    }
                    if (prefix === e.target.value.toLowerCase()) { //if the prefix of the pokemon name is equal to the value of the input
                        res.push(pokemonDataByName[i].name); //add the pokemon name to the results list
                        i += 1;
                    } else {
                        stop = true;
                    }
                }
                //searching left for names that start with the value of input
                stop = false;
                i = pos - 1;
                while (i >= 0 && stop === false) {
                    let j, prefix = "" //the prefix of the pokemon name at the middle of the given array
                    
                    for (j = 0; j < e.target.value.length; j++) {
                        prefix += pokemonDataByName[i].name[j];
                    }

                    if (prefix === e.target.value) { //if the prefix of the pokemon name is equal to the value of the input
                        res.push(pokemonDataByName[i].name); //add the pokemon name to the results list
                        i -= 1;
                    } else {
                        stop = true;
                    }
                }
                //sort the results so as to been viewed at alphabetical order
                res = mergeSort(res);
                setResults(res); //set the results as the names that start with the value of the input
            } else {
                setResults([]);
            }
        } else {
            setResults([]);
        }
    }

    const handleClear = () => {
        //this function will be called each time the user clicks the clear button, in order to clear the value of the input
        clearButtonRef.current.value = "";
        setResults([]);
    }

    const handleResultClick = (result) => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${result}`).then((response) => {
            let data = {};
            data.name = response.data.name;
            data.height = response.data.height;
            data.weight = response.data.weight;
            data.id = response.data.id;
            data.sprites = response.data.sprites;
            data.types = response.data.types.map(t => t.type.name[0].toUpperCase() + t.type.name.substr(1, t.type.name.length - 1)); //make the first letter uppercase
            if (data.types.length > 1) { //we always want to have the double-types at the end of the array
                if (data.types[0] === "Flying" || data.types[0] === "Ground" || data.types[0] === "Dragon") {
                    data.types.reverse();
                }
            }
            data.stats = response.data.stats;
            setSelectedPokemonData(data);
            navigate("./pokemon")
        })

        //find the id of the pokemon name that got clicked at the results 
        const pos = binarySearch(pokemonDataByName, 0, pokemonDataByName.length - 1, result, true);
        const id = pokemonDataByName[pos].id;
        const triad = {
            current: id,
            previous: id === 1 ? pokemonDataByName.length : id - 1,
            next: id === pokemonDataByName.length ? 1 : id + 1
        }
        setTriadPokemon(triad);
    }

    
    return (
        <div className={SearchBarCSS.container}>
            <div className={SearchBarCSS.inputContainer}>
                <input className={SearchBarCSS.input} type="text" placeholder="Search a pokemon" onChange={handleChange} ref={clearButtonRef}/>
                <div className={SearchBarCSS.clearButton} onClick={handleClear}>
                    <p className={SearchBarCSS.clearButtonText}>Clear</p>
                </div>
            </div>
            <div className={SearchBarCSS.resultsContainer}>
                {
                    results.map((result, index) => {
                        return (
                            <div className={SearchBarCSS.result} key={index} onClick={() => handleResultClick(result)}>
                                <p className={SearchBarCSS.resultText}>{result[0].toUpperCase() + result.substr(1, result.length - 1)}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SearchBar;