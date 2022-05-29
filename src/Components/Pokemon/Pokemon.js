import React, { useState, useEffect, useContext } from 'react';
import PokemonCSS from './Pokemon.module.css';
import { AppContext } from '../../App';
import Type from '../Type/Type';
import Stat from '../Stat/Stat';
import { typeColors } from '../../TypeColors';
import axios from 'axios';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { binarySearch } from '../../Algorithms';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';


function Pokemon() {
    const { selectedPokemonData: data, setSelectedPokemonData, pokemonsEntryTexts, pokemonsEvolutionTree,
            triadPokemon, setTriadPokemon, pokemonDataByName, pokemonDataById,favoritePokemons, setFavoritePokemons, 
            dragDropData, setDragDropData, maxFavoritePokemons } = useContext(AppContext); //here i destructure the property selectedPokemonData and save it to a variable data
    const [imageType, setImageType] = useState("front_default");
    const [evolutionImages, setEvolutionImages] = useState({});
    const isFavorite = favoritePokemons.findIndex(pokemon => pokemon.name === data.name) !== -1;

    useEffect(() => {
        //get the data for the evolutions of the pokemon that is currently been displayed
        if (Object.keys(triadPokemon).length === 0) return;
        let i;
        for (i = 0; i < pokemonsEvolutionTree[pokemonDataById[triadPokemon.current - 1].name].length; i++) {
            pokemonsEvolutionTree[pokemonDataById[triadPokemon.current - 1].name.toLowerCase()][i].forEach(p => {
                let item = {};
                axios.get(`https://pokeapi.co/api/v2/pokemon/${p}`).then((response) => {
                    item[p] = response.data.sprites["front_default"];
                    setEvolutionImages(prev => {
                        return {...prev, ...item};
                    })
                })
            })
        } 
    }, [triadPokemon])

    if (Object.keys(data).length === 0) return (
        <div className={PokemonCSS.emptyComponentContainer}>
            <p className={PokemonCSS.emptyComponentText}>You have not selected any pokemon. Navigate through Pokedex screen and choose one!</p>
        </div>
    )

    const handleImageClick = () => {
        if (imageType === "front_default") {
            setImageType("back_default");
        } else {
            setImageType('front_default');
        }
    }

    const toggleFavorite = () => {
        let newFavoritePokemons;
        let newData;
        if (isFavorite) { //if the pokemon is in favorites, then remove it
            newFavoritePokemons = favoritePokemons.filter(pokemon => pokemon.name !== data.name);

            //i have to find in which tier the pokemon that i want to remove from favorites belong to
            const tiers = Object.keys(dragDropData.tiers); //all the tiers
            let selectedTier, favoriteIdsPos, pos;
            tiers.forEach(tier => {
                pos = dragDropData.tiers[tier].favoriteIds.findIndex(id => id === data.id.toString());
                if (pos !== -1) { //if you found a tier that its favoriteIds contain the id of the pokemon that you want to remove from favorites
                    selectedTier = tier;
                    favoriteIdsPos = pos;
                }
            })

            const newFavorites = {...dragDropData.favorites}; //copy the favorite pokemons
            delete newFavorites[data.id]; //remove the pokemon from favorites

            const newTier = {...dragDropData.tiers[selectedTier]}; //copy the selected tier
            newTier.favoriteIds.splice(favoriteIdsPos, 1) // remove the pokemon's id from the selected tier's favoriteIds



            newData = { //create a new data object for the drag drop system, removing the current pokemon from the selected tier
                ...dragDropData,
                favorites: newFavorites,
                tiers: {
                    ...dragDropData.tiers,
                    [selectedTier]: newTier
                }
            }

        } else if (favoritePokemons.length === 0) { //if the pokemon is not in favorites, and favorites are empty, then favorites should have only this pokemon
            newFavoritePokemons = [{name: data.name, id: data.id}];
            
            newData = { //create a new data object for the drag drop system, putting the current pokemon at the first tier
                ...dragDropData,
                favorites: {
                    [data.id.toString()]: {name: data.name, id: data.id.toString()}
                },
                tiers: {
                    ...dragDropData.tiers,
                    "Tier-A": {
                        ...dragDropData.tiers["Tier-A"],
                        favoriteIds: [data.id.toString()]
                    }
                }
            }
        } else if (favoritePokemons.length < 6) { //if the pokemon is not in favorites, and favorites are neither empty and nor full, push the pokemon
            newFavoritePokemons = [...favoritePokemons, {name: data.name, id: data.id}];
            //decide in which tier to put the new favorite pokemons, based on whether the most pokemons are
            let selectedTier;
            if (dragDropData.tiers["Tier-A"].favoriteIds.length < maxFavoritePokemons / 2) {
                selectedTier = "Tier-A";
            } else {
                selectedTier = "Tier-B"
            }

            newData = { //create a new data object for the drag drop system, putting the current pokemon at the selected tier
                ...dragDropData,
                favorites: {
                    ...dragDropData.favorites,
                    [data.id.toString()]: {name: data.name, id: data.id.toString()}
                },
                tiers: {
                    ...dragDropData.tiers,
                    [selectedTier]: {
                        ...dragDropData.tiers[selectedTier],
                        favoriteIds: [...dragDropData.tiers[selectedTier].favoriteIds, data.id.toString()]
                    }
                }
            }

        } else { //if the pokemon is not in favorites, but favorites are full (max 6)
            newFavoritePokemons = favoritePokemons;
            newData = dragDropData;
        }
        setFavoritePokemons(newFavoritePokemons);
        setDragDropData(newData);
        console.log(newFavoritePokemons);
        localStorage.setItem("dragDropData", JSON.stringify(newData)); //save the drag and drop data to the local storage
        localStorage.setItem("favoritePokemons", JSON.stringify(newFavoritePokemons)); //save the favorite pokemons to the local storage
    }

    const changePokemon = (pokemon) => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then((response) => {
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
        })
    }

    const handlePokemonEvolutionClick = (pokemon) => {
        const pos = binarySearch(pokemonDataByName, 0, pokemonDataByName.length - 1, pokemon, true);
        const index = pokemonDataByName[pos].id;
        const triad = {
            current: index,
            previous: index === 1 ? pokemonDataById.length : index - 1,
            next: index === pokemonDataById.length ? 1 : index + 1
        }
        setTriadPokemon(triad);
        changePokemon(pokemon);

    }

    const handleNavigationArrowClick = (arrowType) => {
        let index = triadPokemon.current;
        if (arrowType === "previous") {
            index = triadPokemon.previous;
        }
        else if (arrowType === "next") {
            index = triadPokemon.next;
        }
        const triad = {
            current: index,
            previous: index === 1 ? pokemonDataById.length : index - 1,
            next: index === pokemonDataById.length ? 1 : index + 1
        }
        setTriadPokemon(triad);
        changePokemon(pokemonDataById[index - 1].name);
    }

    let backgroundColor;
    let borderColor;
    if (data.types[0] === "Flying" || data.types[0] === "Ground" || data.types[0] === "Dragon") {
        backgroundColor = `linear-gradient(${typeColors[data.types[0] + "Top"]}, white, ${typeColors[data.types[0] + "Bottom"]})`;
        borderColor = typeColors[data.types[0] + "Top"];
    } else {
        backgroundColor = `linear-gradient(${typeColors[data.types[0]]}, white)`;
        borderColor = typeColors[data.types[0]];
    }
    

    return (
        <div className={PokemonCSS.container}>
            {/*This is the left side of the container*/}
            <div className={PokemonCSS.leftSide}>
                <div className={PokemonCSS.pokemonIdColumn}>
                    <p className={PokemonCSS.pokemonId}>#{data.id}</p>
                </div>
                <img 
                    className={PokemonCSS.pokemonImage} 
                    src={data.sprites[imageType]} 
                    alt="pokemon" 
                    style={{background: backgroundColor, border: `5px solid ${borderColor}`}}
                    onClick={handleImageClick}
                />
                <div className={PokemonCSS.pokemonNameColumn}>
                    <p className={PokemonCSS.pokemonName}>{data.name[0].toUpperCase() + data.name.substr(1, data.name.length - 1)}</p>
                    {
                        isFavorite ? 
                            <IoMdHeart className={PokemonCSS.favoriteIconSelected} onClick={toggleFavorite}/>
                        :
                            <IoMdHeartEmpty className={PokemonCSS.favoriteIconUnSelected} onClick={toggleFavorite}/>
                    }
                </div>
                <div className={PokemonCSS.pokemonTypesColumn}>
                {
                    data.types.map((type, index) => {
                        return <Type type={type} key={index}/>
                    })
                }
                </div>
            </div>
            

            {/*This is the right side of the container*/}
            <div className={PokemonCSS.entryTextsColumn}>
                <p className={PokemonCSS.entryText}>" {pokemonsEntryTexts[data.name.toLowerCase()][0]}</p>
                <p className={PokemonCSS.entryText}>{pokemonsEntryTexts[data.name.toLowerCase()][1]} "</p>
            </div>


            {/*This is the column about stats*/}
            <div className={PokemonCSS.statsColumn}>
                {
                    data.stats.map((stat, index) => {
                        return <Stat name={stat.stat.name} value={stat["base_stat"]} key={index}/>
                    })
                }
            </div> 
            
            {/*This is the column about evolutions*/}
            <div className={PokemonCSS.pokemonEvolutionColumn}>
                {
                    pokemonsEvolutionTree[data.name.toLowerCase()].map((evolutionStep, index) => {
                        return (
                            <div className={PokemonCSS.pokemonEvolutionStep} key={index.toString()}>
                                {
                                    evolutionStep.map(p => {
                                        return (
                                            <div className={PokemonCSS.pokemonEvolution} key={p}>
                                                <img src={evolutionImages[p]} className={PokemonCSS.pokemonEvolutionImage} onClick={() => handlePokemonEvolutionClick(p)}/>
                                                <p className={PokemonCSS.pokemonEvolutionName} >{p[0].toUpperCase() + p.substr(1, p.length - 1)}</p>
                                            </div>

                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>

            {/*This is the column about physical characteristics of the pokemon*/}
            <div className={PokemonCSS.pokemonCharacteristicsColumn}>
                <div className={PokemonCSS.pokemonCharacteristicContainer}>
                    <div className={PokemonCSS.pokemonCharacteristic}>
                        <p className={PokemonCSS.pokemonCharacteristicText}>{data.weight / 10} kg</p>
                    </div>
                    <p className={PokemonCSS.pokemonCharacteristicLabel}>Weight</p>
                </div>
                <div className={PokemonCSS.pokemonCharacteristicContainer}>
                    <div className={PokemonCSS.pokemonCharacteristic}>
                        <p className={PokemonCSS.pokemonCharacteristicText}>{data.height / 10} m</p>
                    </div>
                    <p className={PokemonCSS.pokemonCharacteristicLabel}>Height</p>
                </div>
            </div>

            {/*Pokemon navigation Section*/}
            <div className={PokemonCSS.navigationColumn}>
                <div className={PokemonCSS.navigationLeftArrow} onClick={() => handleNavigationArrowClick("previous")}>
                    <IoIosArrowBack className={PokemonCSS.navigationIcon}/>
                    <p className={PokemonCSS.pokemonId}>#{triadPokemon.previous}</p>
                    <p className={PokemonCSS.navigationPokemonName}>
                        {pokemonDataById[triadPokemon.previous - 1].name[0].toUpperCase() + pokemonDataById[triadPokemon.previous - 1].name.substr(1, pokemonDataById[triadPokemon.previous - 1].name.length - 1)}
                    </p>
                </div>
                <div className={PokemonCSS.navigationRightArrow} onClick={() => handleNavigationArrowClick("next")}>
                    <p className={PokemonCSS.navigationPokemonName}>
                        {pokemonDataById[triadPokemon.next - 1].name[0].toUpperCase() + pokemonDataById[triadPokemon.next -1].name.substr(1, pokemonDataById[triadPokemon.next - 1].name.length - 1)}
                    </p>
                    <p className={PokemonCSS.pokemonId}>#{triadPokemon.next}</p>
                    <IoIosArrowForward className={PokemonCSS.navigationIcon}/>
                </div>
            </div>

        </div>
    )
}

export default Pokemon;