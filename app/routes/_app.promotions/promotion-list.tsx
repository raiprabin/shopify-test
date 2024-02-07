import * as Tabs from '@radix-ui/react-tabs';
import React from 'react';
import { Button } from '~/components/ui/button';
import PromotionCard from './promotion-card';

export interface PromotionDataType {
  promotions: PromotionType[];
  myPromotions: PromotionType[];
}

export interface PromotionType {
  id: number;
  title: string;
  image_url: string;
}

const filterOptions = [
  { label: 'Newest To Oldest', value: 'Newest To Oldest' },
  { label: 'Oldest To Newest', value: 'Oldest To Newest' },
];

const PromotionList = ({
  promotionData,
}: {
  promotionData: PromotionDataType;
}) => {
  const handleOnchange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    console.log('Selected Date:', selectedValue);
  };
  const promotionList = promotionData.promotions;
  const myPromotionList = promotionData.myPromotions;

  return (
    <section className="container">
      <div className="p-6 bg-white">
        <Tabs.Root defaultValue="tab1">
          <div className="flex flex-col lg:flex-row gap-x-6 gap-y-4">
            <Tabs.List
              className="flex flex-col flex-wrap flex-grow border-2 border-t-0 shrink-0 tab-header border-b-grey-50 border-x-0 lg:flex-row"
              aria-label="Manage your account"
            >
              <Tabs.Trigger
                className="bg-white px-4 py-2 flex items-left text-grey-500 font-normal select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 data-[state=active]:border-primary-500 outline-none cursor-pointer not-italic justify-center lg:justify-start"
                value="tab1"
              >
                Available Promotions
              </Tabs.Trigger>
              <Tabs.Trigger
                className="bg-white px-4 py-2 flex items-left text-grey-500 font-normal select-none first:rounded-tl-md last:rounded-tr-md  data-[state=active]:text-primary-500 data-[state=active]:border-b-4 data-[state=active]:border-primary-500 outline-none cursor-pointer not-italic justify-center lg:justify-start"
                value="tab2"
              >
                My Promotions
              </Tabs.Trigger>
            </Tabs.List>
            <div>
              <select
                name="filter"
                onChange={handleOnchange}
                className="w-full !border-grey-100 filter-select"
              >
                {filterOptions.map((filter, index) => (
                  <option value={filter.value} key={index + 'filter'}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Tabs.Content className="pt-6" value="tab1">
            <div className="grid grid-cols-1 gap-6 pb-6 border-b sm:grid-cols-2 lg:grid-cols-3 border-b-grey-25">
              {promotionList.map((promotion: PromotionType) => (
                <div key={promotion.id}>
                  <PromotionCard
                    title={promotion.title}
                    imageURL={promotion.image_url}
                    id={promotion.id}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-6">
              <Button
                type="button"
                variant="primary"
                size="large"
                className="min-w-64"
              >
                Load More
              </Button>
            </div>
          </Tabs.Content>
          <Tabs.Content className="pt-6" value="tab2">
            <div className="grid grid-cols-1 gap-6 pb-6 border-b sm:grid-cols-2 lg:grid-cols-3 border-b-grey-25">
              {myPromotionList.map((promotion: PromotionType) => (
                <div key={promotion.id}>
                  <PromotionCard
                    title={promotion.title}
                    imageURL={promotion.image_url}
                    id={promotion.id}
                    myPromotion={true}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-6">
              <Button
                type="button"
                variant="primary"
                size="large"
                className="min-w-64"
              >
                Load More
              </Button>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </section>
  );
};

export default PromotionList;