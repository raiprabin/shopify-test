import {
  Email,
  InventoryMajor,
  LocationsMinor,
  PhoneMajor,
  PrintMinor,
} from '~/components/icons/orderStatus';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { CompanyProfile } from '~/routes/_app.company-profile/company-profile.server';

export default function CompanyProfileDetail({
  data,
}: {
  data: CompanyProfile | null;
}) {

  return (
    <div className="flex flex-col justify-between gap-10 p-6 bg-white setting-card-info lg:flex-row lg:gap-6">
      <div className="flex flex-col flex-grow gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <figure className="w-[96px] h-[96px] flex items-center justify-center rounded-[50%] border border-grey-50">
              <img
                src={data?.logo_url ?? DEFAULT_IMAGE.LOGO}
                alt="company_logo"
                className="w-[96px] h-[96px] rounded-[50%] object-cover"
              />
            </figure>
            <h3>{data?.company_name && data?.company_name || '-'}</h3>
          </div>
          <div>
            <ul className="grid grid-cols-1 text-lg font-medium md:grid-cols-2 gap-x-10 text-grey-700 sm:grid-cols-2 gap-y-4 ">
              <li className="break-all settings-card-detail">
                <Email />
                <p className="comapny-setting-text">
                  {data?.company_email && data?.company_email || '-'}
                </p>
              </li>
              <li className="break-all settings-card-detail ">
                <PrintMinor />
                <p className="comapny-setting-text">
                  {data?.company_fax && data?.company_fax || '-'}
                </p>
              </li>
              <li className="break-all settings-card-detail">
                <PhoneMajor />
                <p className="comapny-setting-text">
                  {data?.phone && data?.phone || '-'}
                </p>
              </li>
              <li className="break-all settings-card-detail">
                <LocationsMinor />
                <p className="comapny-setting-text">
                  {data?.address && data?.address || '-'}
                </p>
              </li>
            </ul>
          </div>
        </div>
        {data?.description &&
          <div>
            <p className="text-grey-700 text-lg font-normal leading-[22px]">
              {data?.description}
            </p>
          </div>
        }
      </div>


      <div className="flex flex-col gap-4 p-6 bg-primary-50 w-max">
        <h5 className="text-lg italic font-bold leading-6 text-nowrap">
          Preferred Inventory Location
        </h5>
        <ul>
          <li className="break-all settings-card-detail">
            <InventoryMajor />
            {data?.inventory_location_name && data?.inventory_location_name || '-'}
          </li>
        </ul>
      </div>
    </div>
  );
}
