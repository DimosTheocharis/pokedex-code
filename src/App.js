import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import NavBar from './Components/NavBar/NavBar';

import PokedexScreen from './Screens/PokedexScreen/PokedexScreen';
import FavoritesScreen from './Screens/FavoritesScreen/FavoritesScreen';
import PokemonScreen from './Screens/PokemonScreen/PokemonScreen';
import InstructionsScreen from './Screens/InstructionsScreen/InstructionsScreen';


import { mergeSort } from './Algorithms';

export const AppContext = createContext(); //create a context to easily pass values to child elements

const defaultDragDropData = {
  favorites: {
  },
  tiers: {
    "Tier-A": {
      id: "Tier-A",
      favoriteIds: []
    },
    "Tier-B": {
      id: "Tier-B",
      favoriteIds: []
    },
  },
  tierOrder: ["Tier-A", "Tier-B"]
}

const maxFavoritePokemons = 6;

function App() {
  const [visiblePokemonData, setVisiblePokemonData] = useState([]); //a list with the name and id of every pokemon that is current been loaded and displayed
  const [nextPageUrl, setNextPageUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=50");
  const [selectedPokemonData, setSelectedPokemonData] = useState({});
  const [pokemonsEntryTexts, setPokemonsEntryTexts] = useState({});
  const [pokemonsEvolutionTree, setPokemonsEvolutionTree] = useState({});
  const [triadPokemon, setTriadPokemon] = useState({}); //a dictionary with the names and ids of the current, previous and next 
  //pokemon that will be displayed at the Pokemon.js
  const [pokemonDataByName, setPokemonDataByName] = useState([]); //a list with the basic data of all pokemon (sorted by name)
  const [pokemonDataById, setPokemonDataById] = useState([]); //a list with the basic data of all pokemon (sorted by id)
  const [maxShownPokemons, setMaxShownPokemons] = useState(50); //how many pokemon can be appeared in the current moment
  const [selectedType, setSelectedType] = useState("All types");
  const [pokemonTypes, setPokemonTypes] = useState({}); //a dictionary with the types of every pokemon
  
  //load the dragDropData from localStorage, if it does not exist, create one default
  if (localStorage.getItem("dragDropData") === null) {
    localStorage.setItem("dragDropData", JSON.stringify(defaultDragDropData));
  } 

  //load the favoritePokemons fro localStorage, if it does not exist, create one default
  if (localStorage.getItem("favoritePokemons") === null) {
    localStorage.setItem("favoritePokemons", [JSON.stringify([])]);
  }

  const [dragDropData, setDragDropData] = useState(JSON.parse(localStorage.getItem("dragDropData"))); //contains the structure of the drag and drop system at the screen Favorites
  const [favoritePokemons, setFavoritePokemons] = useState(JSON.parse(localStorage.getItem("favoritePokemons"))); //a list with all the favorite pokemons of the user (max 6) where 
  //each pokemon has name and id

  useEffect(() => {
    loadPokemons(); //get the first 30 pokemons

    //load the json file PokemonEntryText.json and get the pokemons entry texts
    let jsonData = require("./PokemonsEntryTexts.json");
    setPokemonsEntryTexts(jsonData); //save the pokemons entry texts 

    let names = Object.keys(jsonData); //jsonData has key-value pair where key is the name of a pokemon
    let data = []
    names.forEach((pokemon, index) => { //create a list with the name and id for all pokemon
      data.push({name: pokemon, id: index + 1})
    })
    
    setPokemonDataById(data);
    const dataByName = mergeSort([...data], "name");
    setPokemonDataByName(dataByName);

    //load the json file PokemonsEvolutionTree.json and get the pokemon evolution tree
    jsonData = require("./PokemonsEvolutionTree.json");
    setPokemonsEvolutionTree(jsonData); //save the evolution tree

    //load the json file PokemonTypes.json and get the types of all pokemons
    jsonData = require("./PokemonTypes.json");
    setPokemonTypes(jsonData);
  }, [])
  

  const loadPokemons = () => {
    axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${maxShownPokemons}`).then((response) => { // get the names of the first pokemons
      const pokemonArray = response.data.results;
      setVisiblePokemonData(pokemonArray.map((pokemon, index) => {
        return {name: pokemon.name, id: index + 1}
      }));
      setNextPageUrl(response.data.next);
      setMaxShownPokemons(prev => prev += 50);
    })     
  }

  const selectType = (type) => {
    if (type === "All types") {
        loadPokemons();
    } else {
        let newPokemonData = [...visiblePokemonData];           
        newPokemonData = newPokemonData.filter(p => {
            const name = p.name;
            return pokemonTypes[name].some(t => t === type.toLowerCase()); //if at least on of the types of the current pokemon is same as selected
            //type, then this pokemon should be appeared
        })     
        setVisiblePokemonData(newPokemonData);                                                                                                                   
    }
    setSelectedType(type);
}


  const handleLoadMore = () => {
    if (selectedType === "All types") {
      //if no filtering, then just push the new pokemons to the current pokemon list
      axios.get(nextPageUrl).then((response) => { // get the names of the next page url
        const pokemonArray = response.data.results;
          setVisiblePokemonData((prev) => prev.concat(pokemonArray.map((pokemon, index) => {
            return {name: pokemon.name, id: index}
          })));
          setNextPageUrl(response.data.next);
        })
    } else {
      //if there is a filtering, the load all pokemons from the start
      setSelectedType("All types");
      loadPokemons();
    }
  }


  return (
    <div>
      <AppContext.Provider value={{selectedPokemonData, setSelectedPokemonData, pokemonsEntryTexts, loadPokemons,
                                  pokemonsEvolutionTree, triadPokemon, setTriadPokemon, visiblePokemonData, setVisiblePokemonData,
                                  pokemonDataByName, pokemonDataById, favoritePokemons, setFavoritePokemons, handleLoadMore,
                                  dragDropData, setDragDropData, maxFavoritePokemons, selectedType, setSelectedType, pokemonTypes, selectType}}>
            <NavBar/>
            <Routes>
                <Route exact path="/" element={<PokedexScreen/>}/>
                <Route path="/favorites" element={<FavoritesScreen/>}/>
                <Route path="/pokemon" element={<PokemonScreen/>}/>
                <Route path="/instructions" element={<InstructionsScreen/>}/>
                <Route path="*" element={<PokedexScreen/>}/>
            </Routes>

      </AppContext.Provider>
    </div>
  )
}

export default App;
