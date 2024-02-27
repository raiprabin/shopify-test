import {Heart, Link} from 'lucide-react';
import {CartIcon} from '~/components/icons/cartIcon';
import {Note} from '~/components/icons/note';
import {NotificationIcon} from '~/components/icons/notification';
import {Routes} from '~/lib/constants/routes.constent';

export function NotificationNavbarMobile({
  setIsHamOpen,
}: {
  setIsHamOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navIcons = [
    {
      id: 1,
      icon: <CartIcon width={'20px'} height={'20px'} />,
      url: Routes.CART_LIST,
      title: 'cart',
      notification: '3',
    },
    {
      id: 2,
      icon: <Note width={'20px'} height={'20px'} />,
      url: Routes.PENDING_ORDER,
      title: 'Pending Order',
      notification: '3',
    },
    {
      id: 3,
      icon: <Heart width={'20px'} height={'20px'} />,
      url: Routes.WISHLIST,
      title: 'Wishlist',
      notification: '3',
    },
    {
      id: 4,
      icon: <NotificationIcon width={'20px'} height={'20px'} />,
      url: Routes.NOTIFICATION,
      title: 'Notifications',
      notification: '3',
    },
  ];
  return (
    <div className="navbar">
      <ul className="nav-list flex gap-5 items-center h-full">
        {navIcons.map((navIcon) => (
          <li className="nav-item relative" key={navIcon.id}>
            <Link
              to={navIcon.url}
              className="info-block"
              onClick={() => setIsHamOpen((prev) => !prev)}
            >
              {' '}
              <div data-tooltip={navIcon.title}>
                <div className="absolute bg-semantic-danger-500 h-[14px] w-[14px] rounded-[50%] right-[-9px] top-[-9px] flex items-center justify-center text-xs text-white font-medium p-2">
                  {navIcon.notification}
                </div>
                <div className="nav-link">{navIcon.icon}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}