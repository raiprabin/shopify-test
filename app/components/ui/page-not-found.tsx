import { Link } from '@remix-run/react';
import { Button } from './button';
import { Routes } from '~/lib/constants/routes.constent';

export function PageNotFound() {
  return (
    <div className="container flex items-center justify-center h-screen">
      <figure className="max-w-[660px] flex items-center flex-col justify-center gap-y-6">
        <img src="/page-not-found2.png" alt="Page Not Found" />
        <figcaption>
          <h4 className='text-center'>
            Oops! Seems like we have hit some slag. The page you're looking for has gone on a brief break, perhaps off for a quick smoko.
          </h4>
          <div className="flex justify-center py-10">
            <Button variant="primary" className="w-full sm:w-[unset]">
              <Link to={Routes.HOME}>Back TO HOMEPAGE</Link>
            </Button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
