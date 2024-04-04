import {useSubmit} from '@remix-run/react';
import {Table} from '@tanstack/react-table';
import {Button} from '~/components/ui/button';
import RemoveItem from '~/components/icons/removeItem';
import {Product} from '~/routes/_app.pending-order_.$groupId/pending-order-details.server';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from '~/components/ui/dialog';

export function DeleteProductModal({table}: {table: Table<Product>}) {
  const submit = useSubmit();

  const handleDelete = () => {
    const formData = new FormData();

    table
      .getSelectedRowModel()
      .flatRows.map((product) =>
        formData.append('productIds', product.original.productId),
      );

    formData.append('_action', 'delete_product');

    submit(formData, {
      method: 'POST',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={
            table.getSelectedRowModel().rows.length === 0
              ? 'disabled'
              : 'destructive'
          }
          className="min-w-[111px] min-h-10"
        >
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] track-an-order p-0 block"
        id="wishlist-remove-dialogue"
      >
        <DialogHeader>
          <DialogTitle className="leading-6 font-bold italic text-lg text-grey-900 flex p-4 justify-center items-center flex-col gap-4">
            <div className="bg-semantic-danger-100 p-[10px] rounded-[50%]">
              <RemoveItem />
            </div>
            <div className="flex items-center justify-center flex-col gap-1">
              <h3 className=" text-grey-800 leading-[22px] text-lg font-medium">
                Delete
              </h3>
              <p className="text-center font-normal leading-[21px] text-base text-neutral-400">
                All products will be removed from your List. Are you sure you
                want to continue?
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="px-4 pb-4 flex">
          <DialogClose asChild>
            <Button type="button" className="uppercase w-full" variant="ghost">
              cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              variant="primary"
              className="w-full italic font-bold uppercase leading6 text-sm "
              onClick={() => {
                handleDelete();
              }}
            >
              Continue
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}