import { INavItem } from "../data-types/INavItem";


const leftNavItems: INavItem[] = [
    {
        name: "Asafarim",
        url: "/",
        icon: "icons/asmlogo.svg",
        active: true,
        children: []
    }, {
        name: "About",
        url: "/about",
        icon: "fas fa-info",
        active: false,
        children: []
    },
    {
        name: "Contact",
        url: "/contact",
        icon: "fas fa-phone",
        active: false,
        children: []
    },
];

export default leftNavItems