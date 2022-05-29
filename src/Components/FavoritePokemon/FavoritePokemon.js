import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import FavoritePokemonCSS from './FavoritePokemon.module.css';
import PokemonThubnail from '../PokemonThubnail/PokemonThubnail';

//this component defines a draggable item at the screen Favorites

function FavoritePokemon({favorite, index}) {
    return (
        <Draggable draggableId={favorite.id} index={index}>
            {(provider, snapshot) => {
                const backgroundColor = snapshot.isDragging ? "rgb(200,200,200)" : "rgb(230,230,230)";
                return (
                    <div 
                        className={FavoritePokemonCSS.container}
                        {...provider.draggableProps}
                        {...provider.dragHandleProps}
                        ref={provider.innerRef}
                    >
                        <PokemonThubnail name={favorite.name} index={parseInt(favorite.id)} backgroundColor={backgroundColor}/>
                    </div>
                )
            }}
        </Draggable>
    )
}

export default FavoritePokemon;