import {InStock} from '~/components/icons/orderStatus';

type ProductCardDetail = {
  productImageUrl: string;
  sku: string;
  productName: string;
  inStock: boolean;
};
export default function WishListProductItem({
  productImageUrl,
  productName,
  sku,
  inStock,
}: ProductCardDetail) {
  return (
    <>
      <div className="flex gap-2 !justify-start">
        <figure className="w-20 bg-grey-25 p-3">
          <img src={productImageUrl} className="" alt="product-image" />
        </figure>
        <div className="max-w-[261px]">
          <div className="flex flex-col gap-2">
            <h5 className="text-lg italic font-bold leading-6 text-grey-900 line-clamp-2 text-ellipsis whitespace-normal h-12">
              {productName}
            </h5>
            <div className="flex gap-5 !justify-start items-center">
              <p className="text-base font-medium text-primary-500">
                SKU:{sku}
              </p>
              <div className="flex gap-2 bg-semantic-success-100 items-center p-2">
                <InStock />
                <p className="uppercase text-[14px] font-medium text-semantic-success-500">
                  {`${inStock ? 'in stock' : 'not in stock'}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
