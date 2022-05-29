import React from 'react';
import TypeCSS from './Type.module.css';
import { typeColors } from '../../TypeColors';


function Type({type}) { // the type of each pokemon, etc Fire
    if (type !== "Flying" && type !== "Ground" && type !== "Dragon") {
        return (
            <div className={TypeCSS.type} style={{backgroundColor: typeColors[type]}}>
                <p className={TypeCSS.nameTag}>{type}</p>
            </div>
        )
    } else {
        return (
            <div className={TypeCSS.halfTopType} style={{backgroundColor: typeColors[`${type}Top`]}}>
                <div className={TypeCSS.halfBottomType} style={{backgroundColor: typeColors[`${type}Bottom`]}}>
                    <p className={TypeCSS.nameTagSpecial}>{type}</p>
                </div>
            </div>
        )
    }
}

export default Type;