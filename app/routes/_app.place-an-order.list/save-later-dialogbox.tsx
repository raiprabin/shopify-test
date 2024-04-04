import {useState} from 'react';
import {useFetcher} from '@remix-run/react';
import {Table} from '@tanstack/react-table';
import {Button} from '~/components/ui/button';
import {DangerAlert} from '~/components/icons/alert';
import {ComboboxDemo} from '~/components/ui/createable-select';
import {Product} from '~/routes/_app.place-an-order.list/place-an-order-list.server';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

interface GroupItem {
  productId: string;
  quantity: number;
  uom: number;
}
type Submit = 'create' | 'update';

export interface SubmitPayload {
  groupItemList: GroupItem[];
  submitType: Submit;
  group: string;
}

export default function CreateGroup({
  table,
  productGroupOptions,
}: {
  table: Table<Product>;
  productGroupOptions: {value: string; label: string}[];
}) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const [isError, setIsError] = useState(false);

  const fetcher = useFetcher();

  const isButtonDisabled = table.getSelectedRowModel().rows.length === 0;

  const groupItemList: GroupItem[] = [];

  table.getSelectedRowModel().flatRows.map((item) => {
    groupItemList.push({
      productId: item.original.productId,
      quantity: item.original.quantity,
      uom: Number(item.original.uom),
    });
  });

  const handleSaveForLater = () => {
    if (selectedValue === null) {
      setIsError(true);
      return;
    }

    const isCreateGroup = Number.isNaN(Number(selectedValue));

    const submitPayload: SubmitPayload = {
      groupItemList,
      submitType: isCreateGroup ? 'create' : 'update',
      group: selectedValue,
    };

    fetcher.submit(
      //@ts-ignore
      submitPayload,
      {method: 'POST', encType: 'application/json'},
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={isButtonDisabled ? 'disabled' : 'primary'}
          className="min-w-[111px] min-h-10"
        >
          Save for later
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[452px] track-an-order p-0 block">
        <DialogHeader>
          <DialogTitle className="leading-6 font-bold italic text-lg text-grey-900 flex p-4 uppercase">
            Create a group
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-1 p-4 border-[1px] border-t-grey-100 border-b-0 border-x-0 ">
          <label
            htmlFor="orderNumber"
            className="text-base text-normal leading-[21px] text-grey-800"
          >
            Group Name
          </label>

          <ComboboxDemo
            isError={isError}
            setIsError={setIsError}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            options={productGroupOptions}
          />

          {isError && (
            <p className="pt-1 error-msg">
              <DangerAlert />
              <span className="pl-2">Group Name is required</span>
            </p>
          )}
        </div>
        <DialogFooter className="block p-4">
          <Button
            type="submit"
            variant={
              isError || fetcher.state === 'submitting' ? 'disabled' : 'primary'
            }
            className="w-full italic font-bold uppercase leading6 text-sm "
            onClick={handleSaveForLater}
          >
            Save for later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}