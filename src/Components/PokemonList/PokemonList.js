import React from 'react';

import PokemonListCSS from "./PokemonList.module.css";
import PokemonThubnail from '../PokemonThubnail/PokemonThubnail';

function PokemonList({pokemons}) {
    return (
        <div className={PokemonListCSS.pokemonList}>
            {
                pokemons.map((pokemon, index) => { //for every pokemon in pokemons, create a Pokemon component with the pokemon's name
                    return <PokemonThubnail key={index} name={pokemon.name} index={index + 1} backgroundColor="rgb(230,230,230)"/>
                })
            }
        </div>
    )
}

export default PokemonList;