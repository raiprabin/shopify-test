import {useState} from 'react';
import {Ordertrack} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import {useHamburgerMenu} from './HamburgerMenuContext';

export function TrackAnOrderButton() {
  const {isOpen, toggleMenu} = useHamburgerMenu();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="track-time flex gap-1 items-center"
          onClick={() => toggleMenu(false)}
        >
          <Ordertrack />
          <p className="uppercase text-white italic text-base font-bold ">
            Track an order
          </p>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[366px] track-an-order p-0 block">
        <DialogHeader>
          <DialogTitle className="leading-6 font-bold italic text-lg text-grey-900 flex p-4">
            Track an order
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1 p-4 border-[1px] border-t-grey-100 border-b-0 border-x-0 ">
          <label
            htmlFor="orderNumber"
            className="text-base text-normal leading-[21px] text-grey-800"
          >
            Purchase Order Number Or Order Number
          </label>
          <input
            type="number"
            id="orderNumber"
            name="orderNumber"
            placeholder="Order Number"
            className="active:!border-grey-100 focus:!border-grey-100 hover:!border-grey-100 focu:bg-white active:bg-white hover:bg-white !bg-white"
          />
        </div>
        <DialogFooter className="block p-4">
          <Button
            type="submit"
            className="w-full italic font-bold uppercase leading6 text-sm "
          >
            Track Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
