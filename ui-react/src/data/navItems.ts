import { INavItem } from "../data-types/INavItem";

const navItems: INavItem[] = [
    
    {
    name: "Asafarim",
    url: "/",
    icon: "./asmlogo.svg",
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
{
    name: "Login",
    url: "/login",
    icon: "fas fa-sign-in-alt",
    active: false,
    children: []
},
{
    name: "Register",
    url: "/register",
    icon: "fas fa-user-plus",
    active: false,
    children: []
},
{
    name: "Profile",
    url: "/profile",
    icon: "fas fa-user",
    active: false,
    children: [
        {
            name: "Logout",
            url: "/logout",
            icon: "fas fa-sign-out-alt",
            active: false,
            children: []
        },
        {
            name: "Change Password",
            url: "/change-password",
            icon: "fas fa-key",
            active: false,
            children: []
        },
        {
            name: "Display Profile",
            url: "/display-profile",
            icon: "fas fa-user",
            active: false,
            children: []
        }
    ]
},
];

export default navItems;