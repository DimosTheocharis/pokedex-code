import React from 'react';

import InstructionsScreenCSS from './InstructionsScreen.module.css';

function InstructionsScreen() {
    return (
        <div className={InstructionsScreenCSS.container}>
            <h1 className={InstructionsScreenCSS.title}>Instructions</h1>
            <ul className={InstructionsScreenCSS.list}>
                <li className={InstructionsScreenCSS.item}>
                    <h1>Pokedex</h1>
                    <p className={InstructionsScreenCSS.text}>The screen Pokedex display the thubnails of the pokemons. It provides information such as 
                        the name, image, id and types of each pokemon. If you want to see more about a pokemon, click its thubnail.
                        You can also search through pokemons, by typing the name of the pokemon you want to find in the input field.
                        Lastly, you can click the button "Load More" at the bottom of the screen, to load more pokemons.
                    </p>
                </li>
                <li className={InstructionsScreenCSS.item}>
                    <h1>Favorites</h1>
                    <p className={InstructionsScreenCSS.text}>The screen Favorites display the thubnails of your favorite pokemons. In order to 
                        set a pokemon as favorite, you have to click a pokemon thubnail and navigate through the screen Pokemon. This screen supports
                        <p className={InstructionsScreenCSS.special}> drag and drop </p> system. There are 2 droppable areas, Tier-A and Tier-B with 
                        max 3 pokemons each one. In order to drag a pokemon, click it, and move it at the disarable position while you holding it.
                        The app support saving of your data, so when you reload the page, your favorite pokemons will be there.
                    </p>
                </li>
                <li className={InstructionsScreenCSS.item}>
                    <h1>Pokemon</h1>
                    <p className={InstructionsScreenCSS.text}>The screen Pokemon display more info about pokemons, than the thubnails.
                        Except of the typical information, the Pokemon screen provide the evolutions of the selected Pokemon, the stats, the physical
                        chatacteristics and its text entry, the original text that each pokemon has in the video games. In this screen, 
                        you can set a pokemon as favorite buy clicking the heart button next to its name, and remove it from favorites 
                        by clicking it again. You can also click the image to turn the pokemon backwards.
                    </p>
                </li>
            </ul>
            <p className="creatorLogo">-Made by Dimos Theocharis-</p>
        </div>
    )
}

export default InstructionsScreen;