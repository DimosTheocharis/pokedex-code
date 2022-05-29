import React from 'react';
import PokemonScreenCSS from './PokemonScreen.module.css';

import Pokemon from '../../Components/Pokemon/Pokemon';


function PokemonScreen() {
    return (
        <div className={PokemonScreenCSS.container}>
            <h1 className={PokemonScreenCSS.title}>Pokemon</h1>
            <Pokemon/>
        </div>
    )
} 


export default PokemonScreen;