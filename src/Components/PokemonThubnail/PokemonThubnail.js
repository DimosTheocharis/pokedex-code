import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../App';
import { useNavigate } from 'react-router-dom';

import PokemonCSS from "./PokemonThubnail.module.css";
import Type from '../Type/Type';

const endpoint = "https://pokeapi.co/api/v2/pokemon/";



function PokemonThubnail({name, index, backgroundColor}) {
    const { setSelectedPokemonData, setTriadPokemon,
            pokemonDataById, favoritePokemons } = useContext(AppContext);
    const [pokemonData, setPokemonData] = useState({}); //the data of the pokemon
    const [loading, setLoading] = useState(true);
    const isFavorite = favoritePokemons.findIndex(pokemon => pokemon.name === pokemonData.name) !== -1;
    const navigate = useNavigate(); //a history object to navigate through

    useEffect(() => {
        setLoading(true);
        axios.get(endpoint + name).then(response => { //fetch the data of the pokemon
            let data = {};
            data.name = response.data.name;
            data.height = response.data.height;
            data.weight = response.data.weight;
            data.id = response.data.id;
            data.sprites = response.data.sprites;
            data.types = response.data.types.map(t => t.type.name[0].toUpperCase() + t.type.name.substr(1, t.type.name.length - 1)); //make the first letter uppercase
            if (data.types.length > 1) { //we always want to have the double-types at the end of the array
                if (data.types[0] === "Flying" || data.types[0] == "Ground" || data.types[0] === "Dragon") {
                    data.types.reverse();
                }
            }
            data.stats = response.data.stats
            setPokemonData(data);
            setLoading(false);
        })
    }, [])

    
    const handlePokemonClick = () => { // this function will be called each time pokemonThubmnail gets clicked
        setSelectedPokemonData(pokemonData);
        //the Pokemon.js component will display the current pokemon, and provide information such us name and id of the previous
        //and next pokemon
        const triad = {
            current: index,
            previous: index === 1 ? pokemonDataById.length : index - 1,
            next: index === pokemonDataById.length ? 1 : index + 1
        }
        setTriadPokemon(triad);
        navigate('/pokemon');
    }


    if (loading) return "Loading...";

    return (
        <div className={PokemonCSS.container} onClick={handlePokemonClick} style={{backgroundColor: backgroundColor}}>
            <p className={PokemonCSS.id}>#{pokemonData.id}</p>
            <img className={PokemonCSS.image} src={pokemonData.sprites.front_default} alt={pokemonData.name}/>
            <p className={PokemonCSS.name} style={isFavorite ? {color: "red"} : null}>{pokemonData.name[0].toUpperCase() + pokemonData.name.substr(1, pokemonData.name.length - 1)}</p>
            <div className={PokemonCSS.typesContainer}>
                {
                    pokemonData.types.map((type, index) => {
                        return <Type type={type} key={index}/>
                    })
                }
            </div>
        </div>
    )
}

export default PokemonThubnail;