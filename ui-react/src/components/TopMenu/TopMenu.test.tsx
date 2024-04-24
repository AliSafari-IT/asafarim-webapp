import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TopMenu from './TopMenu';
import { INavItem } from '../../data-types/INavItem';
const leftNavItems: INavItem[] = [
  { name: 'Home', url: '/', icon: 'icons/home.svg', active: true, children: [] },
  { name: 'About', url: '/about', icon: 'icons/about.svg', active: false, children: [] },
];

const rightNavItems: INavItem[] = [
  { name: 'Services', url: '/services', icon: 'icons/services.svg', active: false, children: [] },
  { name: 'Contact', url: '/contact', icon: 'icons/contact.svg', active: false, children: [] },
];
describe('<TopMenu />', () => {
  test('it should mount', () => {
    render(<TopMenu leftItems={leftNavItems} rightItems={rightNavItems} />);
    
    const topMenu = screen.getByTestId('TopMenu');

    expect(topMenu).toBeInTheDocument();
  });
});