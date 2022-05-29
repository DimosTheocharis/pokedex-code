import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import NavBarCSS from './NavBar.module.css';
import { SidebarData } from '../../SidebarData';
import { IconContext } from 'react-icons';

function NavBar() {
    //this function is responsible for the navigation of the app. It render the menu and the navigation links
    const [showSidebar, setShowSidebar] = useState(false); //whether or not the navigation links should be rendered

    const toggleSidebar = () => {
        setShowSidebar(prev => !prev);
    }

    return (
        <IconContext.Provider value={{color: "white"}}>
            <div className={NavBarCSS.navBar}>
                <Link to="#" className={NavBarCSS.toggleButton}>
                    <FaBars onClick={toggleSidebar}/>
                </Link>
            </div>
            <nav className={showSidebar ? `${NavBarCSS.navMenu} ${NavBarCSS.active}` : NavBarCSS.navMenu}>
                <ul className={NavBarCSS.navMenuItems}>
                    <li className={NavBarCSS.toggleItem} onClick={toggleSidebar}>
                        <Link to="#" className={NavBarCSS.toggleButton}>
                            <AiOutlineClose/>
                        </Link>
                    </li>
                    {
                        SidebarData.map((item) => {
                            return (
                                <li className={NavBarCSS.menuItem} key={item.title} onClick={toggleSidebar}>
                                    <Link to={item.path} >
                                        <item.icon className={NavBarCSS.menuItemIcon}/>
                                        <span className={NavBarCSS.menuItemTitle}>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        </IconContext.Provider>
        
    )
}

export default NavBar;