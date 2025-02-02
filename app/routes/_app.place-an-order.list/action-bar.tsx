import { Table } from '@tanstack/react-table';
import { Button } from '~/components/ui/button';
import CreateGroup from '~/routes/_app.place-an-order.list/save-later-dialogbox';
import { Product } from '~/routes/_app.place-an-order.list/place-an-order-list.server';
import { BackButton } from '~/components/ui/back-button';
import { useSelectedProduct } from '~/routes/_app.pending-order_.$groupId/use-selected-product';
import { Can } from '~/lib/helpers/Can';

export function ActionBar({
  table,
  productGroupOptions,
}: {
  table: Table<Product>;
  productGroupOptions: { value: string; label: string }[];
}) {
  const {
    handleAddToCart,
    numberOfSelectedRows,
    fetcher,
    error,
    setError,
    selectedValue,
    setSelectedValue,
    handleSaveForLater,
  } = useSelectedProduct({
    table,
  });

  return (
    <div className="flex  justify-between lg:items-center my-[30px] flex-col gap-4 lg:flex-row lg:gap-0 items-baseline ">
      <BackButton title="Order List" />
      <div className="flex items-center w-full justify-between lg:justify-[unset] lg:w-[unset] flex-wrap gap-2">
        <p className="text-lg font-bold leading-[22px] text-grey-900 italic">
          {numberOfSelectedRows === 0
            ? 'Please select items to create a group or add to cart. '
            : `${numberOfSelectedRows} ${numberOfSelectedRows > 1 ? 'Items' : 'Item'} `}
        </p>

        <div className="flex gap-2">
          <div className="remove-dialogue">
            <CreateGroup
              error={error}
              table={table}
              fetcher={fetcher}
              setError={setError}
              selectedValue={selectedValue}
              setSelectedValue={setSelectedValue}
              handleSaveForLater={handleSaveForLater}
              productGroupOptions={productGroupOptions}
              numberOfSelectedRows={numberOfSelectedRows}
            />
          </div>
          <Can I="view" a="add_product_list_to_cart">
            <Button
              variant={
                table.getSelectedRowModel().rows.length === 0
                  ? 'disabled'
                  : 'secondary'
              }
              className="min-w-[111px] min-h-10 p-0"
              onClick={handleAddToCart}
            >
              Add to cart
            </Button>
          </Can>
        </div>
      </div>
    </div>
  );
}
