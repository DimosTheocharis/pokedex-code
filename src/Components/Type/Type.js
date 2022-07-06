import React, { useContext } from 'react';
import TypeCSS from './Type.module.css';
import { typeColors } from '../../TypeColors';
import { AppContext } from '../../App';


function Type({type, animated, toggleExpand}) { // the type of each pokemon, etc Fire
    const { selectType } = useContext(AppContext);
    const handleClick = () => {
        //selectType is called whenether user clicks a type from the selector at the Pokedex Screen.
        if (selectType === undefined) return;
        selectType(type);
        toggleExpand();
    }
    
    if (type !== "Flying" && type !== "Ground" && type !== "Dragon") {
        return (
            <div className={`${TypeCSS.type} ${animated ? TypeCSS.animatedType : ""}`} style={{backgroundColor: typeColors[type]}} onClick={handleClick}>
                <p className={TypeCSS.nameTag}>{type}</p>
            </div>
        )
    } else {
        return (
            /*
            <div className={TypeCSS.halfTopType} style={{backgroundColor: typeColors[`${type}Top`]}}>
                <div className={TypeCSS.halfBottomType} style={{backgroundColor: typeColors[`${type}Bottom`]}}>
                    <p className={TypeCSS.nameTagSpecial}>{type}</p>
                </div>
            </div>
            */
           <div className={`${TypeCSS.doubleType} ${animated ? TypeCSS.animatedType : ""}`} onClick={handleClick}>
                <div className={TypeCSS.halfTopType} style={{backgroundColor: typeColors[`${type}Top`]}}></div>
                <div className={TypeCSS.halfBottomType} style={{backgroundColor: typeColors[`${type}Bottom`]}}></div>
                <p className={TypeCSS.nameTagSpecial}>{type}</p>
           </div>
        )
    }
}

export default Type;