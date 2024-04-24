import React, { FC } from 'react';
import styles from './Navbar.module.css';
import { rightNavItems } from '../../data/rightNavItems';
import TopMenu from '../TopMenu/TopMenu';
import leftNavItems from '../../data/leftNavItems';

interface NavbarProps {}

const Navbar: FC<NavbarProps> = () => (
  <div className={styles.Navbar} data-testid="Navbar">
    <TopMenu leftItems={leftNavItems} rightItems={rightNavItems} />
  </div>
);

export default Navbar;
