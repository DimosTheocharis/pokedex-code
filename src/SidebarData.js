import { CgPokemon } from "react-icons/cg"; 
import { MdFavoriteBorder } from "react-icons/md";
import { SiPokemon } from 'react-icons/si';
import { BiHelpCircle } from 'react-icons/bi';

export const SidebarData = [
    {
        title: "Pokedex",
        path: "/",
        icon: SiPokemon
    },
    {
        title: "Favorites",
        path: "/favorites",
        icon: MdFavoriteBorder
    },
    {
        title: "Pokemon",
        path: "/pokemon",
        icon: CgPokemon
    },
    {
        title: "Instructions",
        path: "/instructions",
        icon: BiHelpCircle
    }
] 
