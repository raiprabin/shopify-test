import {DataTable} from '~/components/ui/data-table';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {useTable} from '~/hooks/useTable';
import {Routes} from '~/lib/constants/routes.constent';
import CreateGroup from './remove-item';
import {Button} from '~/components/ui/button';
import {Link} from '@remix-run/react';
import {BackButton} from '~/components/ui/back-button';
import {useState} from 'react';
import {
  Cancel,
  CircleInformationMajor,
  EditItems,
} from '~/components/icons/orderStatus';
import {Done} from '~/components/icons/done';
import {Alert, AlertDescription} from '~/components/ui/alert';
import {useMyProductColumn} from './use-column';
import {ProductData} from './productData';
import {TicketsData} from '../_app.notification/tickets-data';

export default function SingleItem() {
  const itemNameFromApi = 'Gloves';
  const {columns} = useMyProductColumn();
  const {table} = useTable(columns, ProductData);

  function handleRemoveAllItems() {
    // table.toggleAllRowsSelected(false);
  }

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(itemNameFromApi);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    setEditing(false);
  };
  const handleCancelClick = () => {
    setEditing(false);
    setText(itemNameFromApi);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <>
      <div className=" container flex  justify-between md:items-center my-[30px] flex-col gap-4 md:flex-row md:gap-0 items-baseline ">
        <div className="flex items-baseline gap-4  flex-col sm:flex-row sm:items-center">
          <div className="flex items-center">
            <BackButton title="" />
            <div
              className={`${
                editing
                  ? 'bg-primary-25 border border-primary-500 hover:bg-primary-25 '
                  : 'border-none'
              }`}
            >
              {editing ? (
                <div className="flex items-center p-2">
                  <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    className="border-none hover:bg-primary-25 bg-primary-25 text-grey-900 font-bold leading-[36px] text-[30px] italic max-w-[134px] focus:bg-primary-25 !p-0"
                  />
                  <button onClick={handleSaveClick}>
                    <Done />
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="border-l border-grey-200"
                  >
                    <Cancel />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <h3>{text}</h3>
                  <button onClick={handleEditClick}>
                    <EditItems />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Alert className='border-0 rounded-none bg-semantic-info-100 before:content-[""] before:bg-semantic-info-500 before:inline-block before:h-full before:absolute before:w-1 before:left-0 before:top-0 py-2.5 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:left-3 '>
            <CircleInformationMajor />
            <AlertDescription className="text-base !translate-y-0 !pl-6">
              Only 300 items can be added in a group
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-2 items-center w-full justify-between md:justify-[unset] md:w-[unset]">
          <p className="text-lg font-bold leading-[22px] text-grey-900 italic max-w-[281px] md:max-w-[unset]">
            {table.getSelectedRowModel().rows.length === 0
              ? ' '
              : `${table.getSelectedRowModel().rows.length} items selected `}
          </p>

          <div
            className={`flex gap-2 ${
              table.getSelectedRowModel().rows.length === 0 ? 'w-full' : ''
            }`}
          >
            <Button
              variant={
                table.getSelectedRowModel().rows.length === 0
                  ? 'disabled'
                  : 'primary'
              }
              className="min-w-[111px] min-h-10 p-0"
            >
              <Link to={Routes.CART_LIST} className="w-full">
                Add to cart
              </Link>
            </Button>
            <div className="remove-dialogue">
              <CreateGroup
                buttonVariant={
                  table.getSelectedRowModel().rows.length === 0
                    ? 'disabled'
                    : 'danger_dark'
                }
                handleRemoveAllItems={handleRemoveAllItems}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container cart-order">
        <DataTable table={table} />

        {/* pagination starts here */}
        <div className="bg-neutral-white py-4 px-6 border-t flex items-center justify-between">
          <p className="w-40 text-grey-400 font-medium">
            1-7 of {TicketsData.length} Items
          </p>
          <PaginationWrapper pageSize={5} totalCount={TicketsData.length} />
        </div>
      </div>
    </>
  );
}