import type { SidebarItemType } from "@asafarim/sidebar";
import React from 'react';
import { FaShoppingCart, FaFlask, FaWeibo, FaList, FaCar, FaTable, FaBars, FaPaintRoller, FaCogs, FaUser, FaEnvelope, FaCog, FaHome, FaCubes, FaBook } from 'react-icons/fa';

const sidebarItems: SidebarItemType[] = [
    {
        id: 'home',
        label: 'Home',
        icon: <FaHome />,
        url: '/',
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: <FaList />,
        children: [
            {
                id: 'e-commerce',
                label: 'E-commerce',
                icon: <FaShoppingCart />,
                url: '/projects/e-commerce',
            },
            {
                id: 'scientific',
                label: 'Scientific',
                icon: <FaFlask />,
                url: '/projects/scientific',
            },
            {
                id: 'webapp',
                label: 'Webapp',
                icon: <FaWeibo />,
                url: '/projects/webapp',
            },
            {
                id: 'all',
                label: 'All',
                icon: <FaList />,
                url: '/projects/all',
            },
        ]
    },
    {
        id: 'components',
        label: 'UI Components',
        icon: <FaCubes />,
        url: '/components',
        children: [
            {
                id: 'project-cards',
                label: 'Project Cards',
                icon: <FaCar />,
                url: '/components/project-cards',
            },
            {
                id: 'paginated-grid',
                label: 'Paginated Grid',
                icon: <FaTable />,
                url: '/components/paginated-grid',
            },
            {
                id: 'sidebar',
                label: 'Sidebar',
                icon: <FaBars />,
                url: '/components/sidebar',
            }
        ]
    },
    {
        id: 'documentation',
        label: 'Documentation',
        icon: <FaBook />,
        url: '/docs',
        children: []
    },
    {
        id: 'about',
        label: 'About',
        icon: <FaUser />,
        url: '/about',
    },
    {
        id: 'contact',
        label: 'Contact',
        icon: <FaEnvelope />,
        url: '/contact',
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <FaCog />,
        url: '/settings',
        children: [
            {
                id: 'theme',
                label: 'Theme Settings',
                icon: <FaPaintRoller />,
                url: '/settings/theme',
            },
            {
                id: 'preferences',
                label: 'Preferences',
                icon: <FaCogs />,
                url: '/settings/preferences',
            }
        ]
    }
];

export default sidebarItems;