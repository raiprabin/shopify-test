import {Link} from '@remix-run/react';
import Receipt from '../icons/receipt';
import ArrowRight from '../icons/arrowRight';
import Distance from '../icons/distance';
import Bell from '../icons/bell';
import {Separator} from './separator';

const CtaHome = () => {
  return (
    <section className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-3 lg:gap-x-6 place-content-center">
        <Link
          to="/"
          className="cta__btn pr-6 pl-4 py-4 lg:py-6 lg:pl-6 lg:pr-8 text-lg italic font-bold capitalize bg-secondary-500 lg:text-xl xl:text-2xl min-h-[88px] flex justify-between items-center"
        >
          <span className="flex items-center gap-1">
            <Receipt /> Place An Order
          </span>
          <span className="arrow__animation">
            <ArrowRight />
          </span>
        </Link>
        <Link
          to="/"
          className="cta__btn pr-6 pl-4 py-4 lg:py-6 lg:pl-6 lg:pr-8 text-lg italic font-bold capitalize bg-primary-500 text-white lg:text-xl xl:text-2xl min-h-[88px] flex justify-between items-center"
        >
          <span className="flex items-center gap-1">
            <Distance />
            Track An Order
          </span>
          <span className="arrow__animation">
            <ArrowRight fillColor="#ffffff" />
          </span>
        </Link>
        <Link
          to="/"
          className="cta__btn pr-6 pl-4 py-4 lg:py-6 lg:pl-6 lg:pr-8 text-lg italic font-bold capitalize bg-primary-500 text-white lg:text-xl xl:text-2xl min-h-[88px] flex justify-between items-center"
        >
          <span className="flex items-center gap-1">
            <Bell />
            Notifications
          </span>
          <span className="arrow__animation">
            <ArrowRight fillColor="#ffffff" />
          </span>
        </Link>
      </div>
      <Separator className="mt-6" />
    </section>
  );
};

export default CtaHome;