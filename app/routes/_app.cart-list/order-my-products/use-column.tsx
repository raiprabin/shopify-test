import { Link } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TooltipInfo } from '~/components/icons/orderStatus';
import { badgeVariants } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { IndeterminateCheckbox } from '~/components/ui/intermediate-checkbox';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { debounce } from '~/lib/helpers/general.helper';
import { getProductPriceByQty } from '~/routes/_app.product_.$productSlug/product-detail';

export type BulkOrderColumn = {
  productId: string;
  variantId: string;
  quantity: number;
  title: string;
  featuredImage: string;
  sku: string;
  uom: string;
  defaultPrice: string;
  compareAtPrice: string;
  companyPrice: string;
  currency: string;
  defaultUOM: string;
  id: string;
  moq: number;
  uomName: string;
  handle: string;
  unitOfMeasure: [
    {
      unit: string;
      conversion_factor: number;
    },
  ];
  priceRange: [
    {
      minQty: number;
      maxQty: number;
      price: string;
    },
  ];
  totalPrice: number;
};

export function useMyProductColumn(currency?: string, setUpdateCart?: React.Dispatch<React.SetStateAction<boolean>>, setPlaceOrder?: React.Dispatch<React.SetStateAction<boolean>>) {
  const columns = useMemo<ColumnDef<BulkOrderColumn>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: 'items',
        header: 'Items',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          return (
            <ItemsColumn
              title={product.title}
              sku={product.sku}
              featuredImage={product.featuredImage}
              moq={product.moq || 1}
              handle={product?.handle}
            />
          );
        },
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          return (
            <QuantityColumn
              quantity={product.quantity}
              info={info}
              productId={product.productId}
              variantId={product.variantId}
              moq={product.moq || 1}
              lineItemId={product.id}
              setUpdateCart={setUpdateCart}
              setPlaceOrder={setPlaceOrder}
            />
          );
        },
      },
      {
        accessorKey: 'uom',
        header: 'Unit Of Measurement',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;

          return (
            <ProductMeasurement
              uom={product.uom}
              unitOfMeasure={product.unitOfMeasure}
              info={info}
              selectedUOMName={product.uomName}
              productId={product.productId}
              setUpdateCart={setUpdateCart}
            />
          );
        },
      },
      {
        accessorKey: 'total',
        header: 'Price',
        enableSorting: false,
        cell: (info) => {
          const productTotal = info.row.original.companyPrice;
          const priceRange = info.row.original.priceRange;
          const quantity = info.row.original.quantity;
          const product = info.row.original;
          const UOM = info.row.original.uom;
          return (
            <ProductTotal
              totalPrice={productTotal}
              quantity={quantity}
              UOM={UOM}
              unitOfMeasure={product.unitOfMeasure}
              defaultUOM={product.defaultUOM}
              priceRange={priceRange}
              isBulkDetailVisible={info?.row?.getIsExpanded()}
              setIsBulkDetailsVisible={() => info?.row?.toggleExpanded()}
              isRowChecked={info?.row?.getIsSelected()}
              currency={currency || '$'}
            />
          );
        },
      },
    ],
    [],
  );

  return { columns };
}

/**
 * @description Items Column Component
 */
type ItemsColumnType = Pick<
  BulkOrderColumn,
  'title' | 'sku' | 'featuredImage' | 'moq'
> & { handle?: string };

export function ItemsColumn({ title, sku, featuredImage, moq, handle }: ItemsColumnType) {
  return (
    <div className="flex flex-wrap items-center space-x-2">
      <figure className="w-20 p-3 bg-grey-25">
        <img
          src={featuredImage ?? DEFAULT_IMAGE.IMAGE}
          alt="featured"
          className="object-contain object-center h-full"
        />
      </figure>
      <figcaption className="flex flex-col gap-y-1 w-[calc(100%_-_88px)] text-wrap">
        <h5>
          {handle ? <Link to={`/product/${handle}`}>{(title && title) || '--'}</Link> : (title && title) || '--'}
        </h5>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <p>
            <span className="font-semibold text-grey-900 ">SKU: </span>
            {(sku && sku) || 'N/A'}
          </p>
          <div className={`${badgeVariants({ variant: 'inStock' })} !m-0 `}>
            <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>IN
            STOCK
          </div>
        </div>
        <p className="!p-0 !m-0 font-normal leading-4 text-[14px] text-grey-800 capitalize ">
          minimum order({moq})
        </p>
      </figcaption>
    </div>
  );
}
/**
 * @description Quantity Column Component
 */
type QuantityColumnType = Pick<
  BulkOrderColumn,
  'quantity' | 'productId' | 'variantId' | 'moq'
> & { info: any; lineItemId?: string; setUpdateCart?: React.Dispatch<React.SetStateAction<boolean>>; setPlaceOrder?: React.Dispatch<React.SetStateAction<boolean>> };
export function QuantityColumn({
  quantity,
  info,
  productId,
  variantId,
  moq,
  lineItemId,
  setUpdateCart,
  setPlaceOrder
}: QuantityColumnType) {
  const meta = info.table.options.meta;
  const [quantityError, setQuantityError] = useState(true);
  // const handleIncreaseQuantity = () => {
  //   meta?.updateData(info.row.index, info.column.id, quantity + 1 < 1 ? 1 : quantity + 1);
  //   const updateCart = quantity + 1 >= moq;
  //   setQuantityError(updateCart);
  //   setUpdateCart && setUpdateCart(updateCart);
  // }

  // const handleDecreaseQuantity = () => {
  //   meta?.updateData(info.row.index, info.column.id, quantity - 1 < 1 ? 1 : quantity - 1);
  //   const updateCart = quantity - 1 >= moq;
  //   setQuantityError(updateCart);
  //   setUpdateCart && setUpdateCart(updateCart);
  // }

  // const handleInputChange = (event?: any) => {
  //   const inputQuantity = parseInt(event.target.value);
  //   meta?.updateData(info.row.index, info.column.id, inputQuantity);
  //   const updateCart = inputQuantity >= moq;
  //   setUpdateCart && setUpdateCart(updateCart);
  //   const shouldPlaceOrder = inputQuantity >= moq;
  //   setQuantityError(shouldPlaceOrder);
  //   setPlaceOrder && setPlaceOrder(shouldPlaceOrder);
  // }


  const updateQuantity = (newQuantity: any) => {
    meta?.updateData(info.row.index, info.column.id, Math.max(newQuantity, 1));
    const updateCart = newQuantity >= moq;
    setUpdateCart && setUpdateCart(updateCart);
    const shouldPlaceOrder = newQuantity >= moq;
    setQuantityError(shouldPlaceOrder);
    setPlaceOrder && setPlaceOrder(shouldPlaceOrder);
  }
  const handleIncreaseQuantity = () => {
    if (isNaN(quantity + 1)) {
      updateQuantity(moq);
      return;
    }
    updateQuantity(quantity + 1);
  }
  const handleDecreaseQuantity = () => {
    if (isNaN(quantity + 1)) {
      updateQuantity(moq);
      return;
    }
    updateQuantity(quantity - 1);
  }
  const handleInputChange = (event: any) => {
    const inputQuantity = parseInt(event.target.value);
    updateQuantity(inputQuantity);
  }

  useEffect(() => {
    setQuantityError(quantity >= moq);
  }, [quantity])

  return (
    <>
      <div className="flex flex-col gap-[11.5px] mt-[2.2rem] cart__list--quantity">
        <div className="flex items-center">
          <button
            className={`flex items-center justify-center w-10 border border-solid border-grey-200 min-h-10 ${quantity - 1 < moq && "cursor-not-allowed"}`}
            type='button'
            onClick={handleDecreaseQuantity}
            disabled={quantity - 1 < moq}
          >
            -
          </button>
          <input
            type="number"
            className="flex items-center justify-center w-20 text-center border-solid appearance-none border-x-0 border-grey-200 min-h-10"
            value={quantity}
            name="quantity"
            onChange={handleInputChange}
            min={moq || 1}
            max="999999"
            required
          />
          <button
            className="flex items-center justify-center w-10 border border-solid border-grey-200 min-h-10"
            type='button'
            onClick={handleIncreaseQuantity}
          // disabled={quantity + 1 < moq}
          >
            +
          </button>
        </div>
        {!quantityError && <p className='text-sm text-red-500 max-w-40 text-wrap'>Quantity cannot be less than MOQ i.e {moq} or empty</p>}
        <div className="flex items-center gap-1">
          <div className="info-block">
            <p className="flex items-center justify-center h-5 min-w-5 ">
              <div
                data-tooltip={`The minimum order quantity is ${moq}. Orders below this quantity will incur additional surcharges.`}
                className='cursor-pointer'
              >
                <span>
                  <TooltipInfo fillColor="#0092CF" />
                </span>
              </div>
            </p>
          </div>
          <p className='text-sm font-normal capitalize  leading-[16px] text-grey-700'>
            Minimum Order Quantity {moq}
          </p>
        </div>
      </div>
      <input type="hidden" name={`${productId + info.row.index}_productId`} value={productId} />
      <input
        type="hidden"
        name={`${productId + info.row.index}_productVariant`}
        value={variantId}
      />
      <input
        type="hidden"
        name={`${productId + info.row.index}_lineItemId`}
        value={lineItemId}
      />
      <input type="hidden" name={`${productId + info.row.index}_moq`} value={moq} />
      <input type="hidden" name={`${productId + info.row.index}_quantity`} value={quantity} />
    </>
  );
}
/**
 * @description Measurement Column Component
 */
type MeasurementColumnType = Pick<BulkOrderColumn, 'uom' | 'unitOfMeasure'> & {
  info: any;
  selectedUOMName: any;
  productId?: string;
  setUpdateCart?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ProductMeasurement({
  uom,
  unitOfMeasure,
  info,
  selectedUOMName,
  productId,
  setUpdateCart,
}: MeasurementColumnType) {
  const [finalUOM, setUom] = useState(uom);
  const meta = info.table.options.meta;

  const handleUOMChange = (selectedUOM: string) => {
    setUpdateCart && setUpdateCart(true);
    setUom(selectedUOM);
    meta?.updateData(info.row.index, info.column.id, selectedUOM);
  };
  useEffect(() => {
    setUom(uom)
  }, [uom])

  return (
    <>
      <select
        name="uomSelector"
        className="w-full min-w-[92px] place-order h-full border-grey-100"
        onChange={(e: any) => handleUOMChange(e.target.value)}
        value={finalUOM}
      >
        {unitOfMeasure.length > 0 ? (
          unitOfMeasure?.map((uom: any, index: number) => (
            <option value={uom.code} key={index + 'uom'}>
              {uom.unit}
            </option>
          ))
        ) : (
          <option value={finalUOM}>{selectedUOMName}</option>
        )}
      </select>
      <input type="hidden" name={`${productId + info.row.index}_uom`} value={finalUOM} />
    </>
  );
}
/**
 * @description Total Column Component
 */
export function ProductTotal({
  totalPrice,
  isBulkDetailVisible,
  setIsBulkDetailsVisible,
  isRowChecked,
  priceRange,
  quantity,
  unitOfMeasure,
  defaultUOM,
  UOM,
  currency,
}: {
  totalPrice: string;
  isBulkDetailVisible: boolean;
  isRowChecked: boolean;
  setIsBulkDetailsVisible: () => void;
  priceRange: [
    {
      minQty: number;
      maxQty: number;
      price: string;
    },
  ];
  unitOfMeasure: any;
  defaultUOM: any;
  quantity: number;
  UOM: any;
  currency: string;
}) {
  const prices = getProductPriceByQty(
    quantity,
    unitOfMeasure,
    UOM,
    defaultUOM,
    priceRange,
    totalPrice,
  );

  return (
    <div className="flex flex-col gap-4 items-baseline min-w-[110px]">
      <div className="flex flex-col gap-1">
        <div className="">
          <p className="flex mb-1.5 text-semantic-success-500 font-medium text-sm uppercase">
            BUY PRICE
            <div className="info-block">
              <p className="flex items-center justify-center w-5 h-5 text-xs">
                <div
                  className="cursor-pointer price-tooltip"
                  data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                >
                  <span>
                    <TooltipInfo />
                  </span>
                </div>
              </p>
            </div>
          </p>
        </div>
        <p className="text-grey-900 text-lg leading-5.5 italic">
          {currency}
          &nbsp;{prices?.toFixed(2) || 'N/A'}
        </p>
        <p className="text-sm italic font-bold leading-normal text-grey-500">
          (Excl. GST)
        </p>
      </div>
      {priceRange.length > 0 && (
        <Button
          onClick={setIsBulkDetailsVisible}
          type="button"
          className={`${isRowChecked ? 'bg-white' : 'bg-primary-200'
            }text-[14px] italic font-bold leading-6 uppercase p-0 bg-white text-grey-900 underline hover:bg-white decoration-primary-500 underline-offset-4`}
        >
          {isBulkDetailVisible ? 'Hide' : 'View'} BULK PRICE
        </Button>
      )}
    </div>
  );
}
