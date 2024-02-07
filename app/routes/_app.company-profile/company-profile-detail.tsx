import {
  Email,
  InventoryMajor,
  LocationsMinor,
  PhoneMajor,
  PrintMinor,
} from '~/components/icons/orderStatus';
import { Locations, MainContact, Metafield } from './company-profile.server';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';

type CompanyProfile = {
  meta: Record<string, Metafield>;
  id: string;
  name: string;
  note: string;
  externalId: string;
  mainContact: MainContact;
  locations: Locations;
}


export default function CompanyProfileDetail({ data }: { data: CompanyProfile | null }) {
  const locationNode = data?.locations?.nodes[0];

  return (
    <div className="flex flex-col justify-between gap-10 p-6 bg-white setting-card-info lg:flex-row lg:gap-6">
      <div className="flex flex-col gap-6 max-w-[unset] lg:max-w-[650px] xl:max-w-[805px]">
        <div className="">
          <div className="flex items-center gap-4">
            <figure className="w-[96px] h-[96px] flex items-center justify-center rounded-[50%] border border-grey-50">
              <img src={data?.meta?.image_url?.value ?? DEFAULT_IMAGE.LOGO} alt="company_logo" className='w-[96px] h-[96px] rounded-[50%] object-cover' />
            </figure>
            <h3>{data?.name ?? "-"}</h3>
          </div>
          <div className=" max-w-[439px]">
            <ul className="grid grid-cols-1 text-lg font-medium gap-x-10 text-grey-700 sm:grid-cols-2 ">
              <li className="settings-card-detail">
                <Email />
                {data?.mainContact?.customer?.email ?? "-"}
              </li>
              <li className="settings-card-detail">
                <PrintMinor />{data?.meta?.fax?.value ?? "-"}
              </li>
              <li className="settings-card-detail">
                <PhoneMajor />
                {locationNode?.billingAddress?.phone ?? "-"}
              </li>
              <li className="settings-card-detail">
                <LocationsMinor />
                {locationNode?.billingAddress?.address1 ?? "-"}
              </li>
            </ul>
          </div>
        </div>
        <div>
          <p className="text-grey-700 text-lg font-normal leading-[22px]">
            {data?.note}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6  bg-primary-50 flex-grow">
        <h5 className="text-lg italic font-bold leading-6">
          Preferred Inventory Location
        </h5>
        <ul className="grid grid-cols-1 text-lg font-medium gap-x-10 gap-y-4 text-grey-700 xl:grid-cols-2">
          <li className="settings-card-detail ">
            <InventoryMajor />
            {locationNode?.name ?? "-"}
          </li>
          <li className="settings-card-detail ">
            <LocationsMinor /> {locationNode?.shippingAddress?.address1 ?? "-"}
          </li>
          <li className="settings-card-detail ">
            <PhoneMajor />
            {locationNode?.shippingAddress?.phone ?? "-"}
          </li>
        </ul>
      </div>
    </div>
  );
}