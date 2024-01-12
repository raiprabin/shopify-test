import {useEffect, useRef, useState} from 'react';
import {MenuItems} from '../bottom-header';
import ArrowUp from '~/components/icons/arrowUp';
import ArrowDown from '~/components/icons/arrowDown';
import {Link} from '@remix-run/react';
import {DropdownMenu} from './dropdownItems';

export const SingleNavItem = ({
  menu,
  depthLevel,
}: {
  menu: MenuItems;
  depthLevel: number;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', (event) =>
      handleClickOutside(event),
    );

    //Clean up function => Cleaning up our Event Listeners
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      <li
        className=" flex flex-row items-center justify-center
          text-white italic font-bold text-lg gap-1 p-0 menu-items"
        ref={menuRef}
      >
        <Link to="" className="flex items-center gap-1 relative menu-links">
          <div className={`${isDropdownOpen ? 'active' : ''} menu-icon`}>
            {menu.icon}
          </div>
          {menu.submenu ? (
            <>
              <button
                type="button"
                aria-haspopup="menu"
                className={`flex gap-2 items-center font-bold italic text-lg arrow-toggle  hover:text-secondary-500 focus:text-secondary-500 outline-none  active:text-secondary-500 focus:outline-none ${
                  isDropdownOpen ? 'text-secondary-500' : ''
                }`}
                aria-expanded={isDropdownOpen ? 'true' : 'false'}
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                {menu.title}{' '}
                {isDropdownOpen ? (
                  <ArrowUp fillColor="#FFE600" />
                ) : (
                  <ArrowDown />
                )}
              </button>

              <DropdownMenu
                submenus={menu.submenu}
                isOpen={isDropdownOpen}
                depthLevel={depthLevel}
                type={menu.type === 'megamenu' ? 'megamenu' : 'normal'}
              />
            </>
          ) : (
            <span>{menu.title}</span>
          )}
        </Link>
      </li>
    </>
  );
};