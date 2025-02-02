import {
  NavLink,
  Outlet,
  useFetcher,
  useLocation,
  useRouteLoaderData,
} from '@remix-run/react';
import { BackButton } from '~/components/ui/back-button';
import { Routes } from '~/lib/constants/routes.constent';
import { Separator } from '~/components/ui/separator';
import { Button } from '~/components/ui/button';
import { LoaderFunctionArgs, redirect } from '@remix-run/server-runtime';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
export type NotificationListItem = {
  id: string;
  date: string;
  news: string;
  orderNo: number;
  customer: string;
};

const routes = [
  {
    link: Routes.NOTIFICATIONS_NEW,
    name: 'New For You',
  },
  {
    link: Routes.NOTIFICATIONS_PREVIOUS,
    name: 'Previous Notifications',
  },
];

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const url = new URL(request.url);

  if (url.pathname === '/notification') {
    return redirect(`${Routes.NOTIFICATIONS_NEW}`);
  }

  return null;
}

export default function route() {
  const { notificationCount } = useRouteLoaderData('routes/_app') as {
    notificationCount: number;
  };

  const location = useLocation();

  const fetcher = useFetcher();

  return (
    <section className="container">
      <div className="flex items-center justify-between">
        <BackButton title="Notifications" />
        {/* <div className="flex items-center gap-2">
          <p className="text-lg font-bold leading-[22px] text-grey-900 italic">
            {news?.length === 1 ? '1 item ' : `${news.length} items `}
          </p>
          <div className="remove-dialogue">
            <ClearAllDialouge handleRemoveAllItems={() => {}} />
          </div>
        </div> */}
      </div>
      <div className="relative p-6 mt-6 bg-neutral-white">
        <div className="flex flex-col justify-between gap-4 mb-6 sm:items-center sm:flex-row sm:mb-0">
          <div className="flex items-center space-x-4 border-b border-solid border-slate-200 sm:border-b-0">
            {routes.map((route) => (
              <NavLink
                key={route.link}
                to={route.link}
                className={({ isActive, isPending }) =>
                  isPending
                    ? 'py-2 px-4 text-center border-b-[3px] border-b-transparent'
                    : isActive
                      ? 'py-2 px-4 text-center border-b-[3px] text-primary-500 border-b-primary-500'
                      : 'py-2  px-4 text-center border-b-[3px] border-b-transparent text-grey-400'
                }
              >
                {route.name}
              </NavLink>
            ))}
          </div>
          {location.pathname === Routes.NOTIFICATIONS_NEW &&
            notificationCount > 0 && (
              <fetcher.Form method="PUT" action={Routes.NOTIFICATIONS_NEW} className='ml-auto'>
                <Button
                  type="submit"
                  variant="link"
                  className="before:!bottom-1.5 sm:!px-1 bg-primary-500 sm:bg-transparent text-white sm:text-inherit"
                >
                  mark all as read
                </Button>
              </fetcher.Form>
            )}
        </div>
        <Separator className="hidden mb-6 sm:block" />
        <Outlet />
      </div>
    </section>
  );
}
