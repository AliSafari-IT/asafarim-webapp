import { INavItem } from "../data-types/INavItem";

export const rightNavItems: INavItem[] = [
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
                icon: "fas fa-user-circle",
                active: false,
                children: []
            }
        ]
    }
];
