import React from 'react';
import { INavItem } from '../../data-types/INavItem';
import { DarkThemeToggle, Dropdown, Navbar } from 'flowbite-react';

interface TopMenuProps {
    leftItems: INavItem[];
    rightItems: INavItem[];
    className?: string;
}

const TopMenu: React.FC<TopMenuProps> = ({ leftItems, rightItems, className = '' }) => {
  const renderNavItem = (item: INavItem) => {
      if (item.children && item.children.length > 0) {
          return (
              <Dropdown label={item.name} inline={true} key={item.name} aria-label={`Dropdown for ${item.name}`}>
                  {item.children.map(child => (
                      <Dropdown.Item href={child.url} key={child.name}>
                          <i className={child.icon + ' p-1 mr-2'} aria-hidden="true"></i>
                          {child.name}
                      </Dropdown.Item>
                  ))}
              </Dropdown>
          );
      }
      return (
          <Navbar.Link href={item.url} key={item.name} active={item.active}>
              <i className={item.icon + ' px-2'} aria-hidden="true"></i>
              {item.name}
          </Navbar.Link>
      );
  };

  const renderNavItems = (items: INavItem[]) => items.map(renderNavItem);

  return (
      <Navbar fluid={true} rounded={true} className={className}>
          <Navbar.Brand href="/" >
              <div className="flex items-center">
                <img src="./asmlogo.svg" alt="Asafarim Logo" width={"30"} height={"30"} className='dark:invert'/>
              </div>
          </Navbar.Brand>
          <Navbar.Collapse>
              <div className="flex justify-around flex-grow md:order-1">
                  <div className="flex">
                      {renderNavItems(leftItems)}
                  </div>
                  <div className="flex">
                      {renderNavItems(rightItems)}
                  </div>
              </div>
          </Navbar.Collapse>
          <div className="flex md:order-2">
              <DarkThemeToggle />
              <Navbar.Toggle />
          </div>
      </Navbar>
  );
};

export default TopMenu;