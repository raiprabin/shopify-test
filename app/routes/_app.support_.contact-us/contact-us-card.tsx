import {PhoneIcon} from '~/components/icons/phone-icon';
import {ContactUsDataType} from '~/routes/_app.support_.contact-us/contact-us-data';
import {LargeMailIcon} from '~/components/icons/mail';
import {BuildingIcon} from '~/components/icons/building-icon';

export function ContactUsCard({
  service,
  imageUrl,
  name,
  phone,
  email,
  department,
}: ContactUsDataType) {
  return (
    <div>
      <h4 className="px-6 py-3 bg-primary-500 text-neutral-white">{service}</h4>
      <figure className="p-6 bg-neutral-white">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-14 w-14 rounded-full">
            <img
              src={imageUrl}
              alt="image-url"
              className="w-full h-full object-cover"
            />
          </div>
          <h4>{name}</h4>
        </div>
        <figcaption>
          <ul>
            <li className="flex items-center space-x-4">
              <p className="flex items-center w-24 text-lg leading-5.5">
                <PhoneIcon />
                Phone
              </p>
              <p className="text-lg leading-5.5 font-medium">{phone}</p>
            </li>
            <li className="flex items-center space-x-4">
              <p className="flex items-center w-24 text-lg leading-5.5">
                <LargeMailIcon />
                Email
              </p>
              <p className="text-lg leading-5.5 font-medium">{email}</p>
            </li>
            <li className="flex items-center space-x-4">
              <p className="flex items-center w-24 text-lg leading-5.5">
                <BuildingIcon />
                Department
              </p>
              <p className="text-lg leading-5.5 font-medium">{department}</p>
            </li>
          </ul>
        </figcaption>
      </figure>
    </div>
  );
}
