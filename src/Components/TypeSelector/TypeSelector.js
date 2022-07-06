import React, { useState, useContext } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { AppContext } from '../../App';

import TypeSelectorCSS from "./TypeSelector.module.css";
import Type from '../Type/Type';

const typeColors = [
    "Fire", "Grass", "Poison", "Water", "Normal", "Flying",
    "Fighting", "Fairy", "Rock", "Psychic", "Electric", "Steel",
    "Dragon", "Ice", "Ghost", "Dark", "Bug", "Ground"
]


function TypeSelector() {
    const [expand, setExpand] = useState(false);
    const [types, setTypes] = useState(typeColors);
    const { selectedType, selectType } = useContext(AppContext);

    const toggleExpand = () => {
        setExpand(prev => !prev);
    }

    const handleSelectType = (type) => {
        selectType(type);
        toggleExpand();
    }


    return (
        <div className={TypeSelectorCSS.container}>
            <div className={TypeSelectorCSS.valueContainer}>
                {
                    selectedType === "All types" ? 
                        "All types" 
                    :
                        <Type type={selectedType} animated={false}/>
                }
            </div>
            <div className={TypeSelectorCSS.buttonContainer} onClick={toggleExpand}>
                {
                    expand ? 
                        <IoMdArrowDropup size={30}/> 
                    :
                        <IoMdArrowDropdown size={30}/>
                }
            </div>
            <div className={TypeSelectorCSS.valuesContainer}>
                {
                    expand ? 
                        <div className={TypeSelectorCSS.values}>
                            {
                                types.map((value, index) => {
                                    return (
                                        <Type type={value} animated={true} key={index} toggleExpand={toggleExpand}/>
                                    )
                                })
                            }
                            <div className={TypeSelectorCSS.defaultValue} onClick={() => handleSelectType("All types")}>All types</div>
                        </div>
                    : 
                        null
                }
            </div>
        </div>
    )
}

export default TypeSelector;