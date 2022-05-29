import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { DragDropContext } from 'react-beautiful-dnd';

import FavoritesScreenCSS from './FavoritesScreen.module.css';
import Tier from '../../Components/Tier/Tier';


function FavoritesScreen() {
    const { dragDropData, setDragDropData, maxFavoritePokemons } = useContext(AppContext);

    const handleDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return; //if the Draggable is dropped outside of a Droppable, then drag and drop can't be performed

        if (source.droppableId === destination.droppableId && source.index === destination.index) return; //if the Draggable didn't 
        //move at all then drag and drop can't be performed


        const startTier = dragDropData.tiers[source.droppableId]; //the tier where the Draggable got dragged from
        const endTier = dragDropData.tiers[destination.droppableId]; //the tier where the Draggable got dragged to
        
        if (startTier === endTier) {
            //if the Draggable is moving at the same tier
            
            const newFavoriteIds = [...startTier.favoriteIds]; //get a copy of the favoriteIds of the current tier
            newFavoriteIds.splice(source.index, 1); //remove the id of Draggable
            newFavoriteIds.splice(destination.index, 0, draggableId); //put the id of the Draggable at the position that it dropped
            
            const newTier = { //create a new tier with the changes that got performed
                ...startTier,
                favoriteIds: newFavoriteIds
            }

            const newData = { //create a new data object with the old data and the changed tier
                ...dragDropData,
                tiers: {
                    ...dragDropData.tiers,
                    [source.droppableId]: newTier
                }
            }

            setDragDropData(newData); //save the changes
            localStorage.setItem("dragDropData", JSON.stringify(newData)); //save the drag and drop data to the local storage
        } 
        
        else if (dragDropData.tiers[destination.droppableId].favoriteIds.length < maxFavoritePokemons / 2) {
            //if the Draggable is moving at different tiers
            //changes can be performed only when destination tier has no more than half of the max favorite pokemons

            const newStartFavoriteIds = [...startTier.favoriteIds]; //get a copy of the favoriteIds of the start tier
            newStartFavoriteIds.splice(source.index, 1); //remove the id of Draggable from the ids of the start tier
            
            const newEndFavoriteIds = [...endTier.favoriteIds]; //get a copy of the favoriteIds of the end tier
            newEndFavoriteIds.splice(destination.index, 0, draggableId); //put the id of the Draggable at the position that it dropped in the end tier

            const newStartTier = { //create a new tier with the changes that got performed in the start tier
                ...startTier,
                favoriteIds: newStartFavoriteIds
            }

            const newEndTier = { //create a new tier with the changes that got performed
                ...endTier,
                favoriteIds: newEndFavoriteIds
            }

            const newData = { //create a new data object with the old data and the changed start and and tiers
                ...dragDropData,
                tiers: {
                    ...dragDropData.tiers,
                    [source.droppableId]: newStartTier,
                    [destination.droppableId]: newEndTier
                }
            }

            setDragDropData(newData); //save the changes
            localStorage.setItem("dragDropData", JSON.stringify(newData)); //save the drag and drop data to the local storage
        
        } else if (dragDropData.tiers[source.droppableId].favoriteIds.length === maxFavoritePokemons / 2 && dragDropData.tiers[destination.droppableId].favoriteIds.length === maxFavoritePokemons / 2)  {
            if (destination.index >= maxFavoritePokemons / 2) return; //if the Draggable got dragged at the end of a full tier, then drag and drop can't be performed
            //if the Draggable is moving at different tiers and both source and destination are full, then swap pokemons

            const swapPokemonId = endTier.favoriteIds[destination.index] //the id of the pokemon that is going to be swapped with the draggableID
            
            const newStartFavoriteIds = [...startTier.favoriteIds]; //get a copy of the favoriteIds of the start tier
            newStartFavoriteIds.splice(source.index, 1) //remove the id of Draggable from the ids of the start tier
            newStartFavoriteIds.splice(destination.index, 0, swapPokemonId); //put the id of the pokemon that is going to be swapped in the start tier

            const newEndFavoriteIds = [...endTier.favoriteIds]; //get a copy of the favoriteIds of the end tier
            newEndFavoriteIds.splice(destination.index, 1) //remove the id of the pokemon that is goind to be swapped from the ids of the end tier
            newEndFavoriteIds.splice(source.index, 0, draggableId) //put the id of the Draggable in the end tier

            const newStartTier = { //create a new tier with the changes that got performed in the start tier
                ...startTier,
                favoriteIds: newStartFavoriteIds
            }

            const newEndTier = { //create a new tier with the changes that got performed
                ...endTier,
                favoriteIds: newEndFavoriteIds
            }

            const newData = { //create a new data object with the old data and the changed start and and tiers
                ...dragDropData,
                tiers: {
                    ...dragDropData.tiers,
                    [source.droppableId]: newStartTier,
                    [destination.droppableId]: newEndTier
                }
            }

            setDragDropData(newData); //save the changes
            localStorage.setItem("dragDropData", JSON.stringify(newData)); //save the drag and drop data to the local storage
        } 
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={FavoritesScreenCSS.container}>
                <h1 className={FavoritesScreenCSS.title}>Favorites</h1>
                {
                    dragDropData.tierOrder.map(tierId => {
                        const tier = dragDropData.tiers[tierId];
                        const favorites = tier.favoriteIds.map(favoriteId => dragDropData.favorites[favoriteId]);
                        
                        return (
                            <Tier favorites={favorites} tier={tier} key={tierId}/>
                        )
                    })
                }
            </div>
            <p className="creatorLogo">-Made by Dimos Theocharis-</p>
        </DragDropContext>

    )
} 

export default FavoritesScreen;