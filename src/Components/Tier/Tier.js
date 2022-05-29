import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import TierCSS from './Tier.module.css';
import FavoritePokemon from '../FavoritePokemon/FavoritePokemon';

//this component defines a droppable area at the screen Favorites

function Tier({tier, favorites}) {
    return (
        <div className={TierCSS.container}>
            <h1 >{tier.id}</h1>
            <Droppable droppableId={tier.id} direction="horizontal">
                {(provided) => {
                    return (
                        <div 
                            className={TierCSS.tierList}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {
                                favorites.map((favorite, index) => {
                                    return (
                                        <FavoritePokemon favorite={favorite} key={favorite.id} index={index}/>
                                    )
                                })
                            }
                            {provided.placeholder}
                        </div>
                    )
                }}
            </Droppable>
        </div>
    )
}

export default Tier;
