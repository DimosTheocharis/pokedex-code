import React from 'react';
import { statColors } from '../../StatColors';
import StatCSS from './Stat.module.css';

const maxStatValue = 200;

function Stat({name, value}) {
    const barAboveWidth = value / maxStatValue * 100;
    return (
        <div className={StatCSS.container}>
            <p className={StatCSS.name}>{name}:</p>
            {/*the bar of the stat*/}
            <div className={StatCSS.barUnderneath}>
                <div className={StatCSS.barAbove} style={{backgroundColor: statColors[name], width: `${barAboveWidth}%`}}>
                </div>
            </div>
        </div>
    )
}

export default Stat;