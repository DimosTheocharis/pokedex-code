import React, { useContext } from 'react';
import { AppContext } from '../../App';

import PokedexScreenCSS from './PokedexScreen.module.css';
import SearchBar from '../../Components/SearchBar/SearchBar';
import PokemonList from '../../Components/PokemonList/PokemonList';

function PokedexScreen() {
    const { visiblePokemonData, handleLoadMore } = useContext(AppContext);

    return (
        <div className={PokedexScreenCSS.container}>
            <h1 className={PokedexScreenCSS.title}>Pokedex</h1>
            <SearchBar/>
            <PokemonList pokemons={visiblePokemonData}/> 
            <button className={PokedexScreenCSS.loadMore} onClick={handleLoadMore}>
              <p className={PokedexScreenCSS.loadMoreText}>Load More</p>
            </button>
            <p className="creatorLogo">-Made by Dimos Theocharis-</p>
        </div>
    )
}

export default PokedexScreen;