import {z} from 'zod';
import {Input} from '~/components/ui/input';
import {Button} from '~/components/ui/button';
import {ValidatedForm} from 'remix-validated-form';
import {Separator} from '~/components/ui/separator';
import {Link, useSearchParams} from '@remix-run/react';
import {Routes} from '~/lib/constants/routes.constent';
import {withZod} from '@remix-validated-form/with-zod';
import {SheetClose, SheetFooter} from '~/components/ui/sheet';
import {DatePickerWithRange} from '~/components/ui/date-range-picker';
import SelectInput, {SelectInputOptions} from '~/components/ui/select-input';

// Dummy Order Status Options
const orderStatusOptions: SelectInputOptions[] = [
  {title: 'Closed', value: 'closed'},
  {title: 'Pending', value: 'pending'},
  {title: 'In Progress', value: 'in_progress'},
];

const OrderFilterFormSchema = z.object({
  poNumber: z.string().trim().optional(),
  orderStatus: z.string().trim().optional(),
  orderDateRange: z
    .object({
      orderDateFrom: z.string().trim().optional(),
      orderDateTo: z.string().trim().optional(),
    })
    .optional(),

  deliveryDateRange: z
    .object({
      deliveryDateFrom: z.string().trim().optional(),
      deliveryDateTo: z.string().trim().optional(),
    })
    .optional(),
});

export const OrderFilterFormSchemaValidator = withZod(OrderFilterFormSchema);

export type OrderFilterFormType = z.infer<typeof OrderFilterFormSchema>;

export type OrderFilterFormFieldNameType = keyof OrderFilterFormType;

export default function OrderFilterForm() {
  const [searchParams] = useSearchParams();

  const defaultValues: OrderFilterFormType = {};

  const keys: OrderFilterFormFieldNameType[] = ['poNumber', 'orderStatus'];

  keys.forEach((key) => {
    defaultValues[key] = searchParams.get(key) || undefined;
  });

  const orderDateFrom = searchParams.get('orderDateFrom');

  const orderDateTo = searchParams.get('orderDateTo');

  const defaultOrderDateRangeValues = {
    from: orderDateFrom ? new Date(orderDateFrom) : undefined,
    to: orderDateTo ? new Date(orderDateTo) : undefined,
  };

  const deliveryDateFrom = searchParams.get('deliveryDateFrom');

  const deliveryDateTo = searchParams.get('deliveryDateTo');

  const defaultDeliveryDateRangeValues = {
    from: deliveryDateFrom ? new Date(deliveryDateFrom) : undefined,
    to: deliveryDateTo ? new Date(deliveryDateTo) : undefined,
  };

  return (
    <ValidatedForm
      method="GET"
      data-cy="filter-form"
      id="order-filter-form"
      defaultValues={defaultValues}
      validator={OrderFilterFormSchemaValidator}
    >
      <div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h5 className="pb-2">Order Date</h5>
            <SheetClose asChild>
              <Link
                to={Routes.ORDERS}
                className="italic text-primary-500 font-bold text-sm leading-6"
              >
                RESET ALL
              </Link>
            </SheetClose>
          </div>
          <DatePickerWithRange
            fromFieldName="orderDateFrom"
            toFieldName="orderDateTo"
            dateRange={defaultOrderDateRangeValues}
          />
        </div>
        <Separator />{' '}
        <div className="p-6">
          <h5 className="pb-2">Delivery Date</h5>
          <DatePickerWithRange
            fromFieldName="deliveryDateFrom"
            toFieldName="deliveryDateTo"
            dateRange={defaultDeliveryDateRangeValues}
          />
        </div>
        <Separator />
        <div className="p-6">
          <div className="">
            <h5 className="pb-2">Order Status</h5>
          </div>
          <SelectInput
            name="orderStatus"
            label="Order Status"
            options={orderStatusOptions}
            data-cy="orderStatus"
          />
        </div>
        <Separator />
        <div className="p-6">
          <h5 className="pb-2">Purchase Order Number</h5>
          <Input
            name="poNumber"
            placeholder="Purchase Order Number"
            data-cy="poNumber"
          />
        </div>
      </div>
      <Separator />
      <SheetFooter className="grid grid-cols-2 gap-4 p-6 shadow-top absolute bottom-0 inset-x-0">
        <SheetClose asChild>
          <Button type="button" variant="ghost">
            cancel
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            type="submit"
            data-cy="apply-filter"
            className="whitespace-nowrap"
          >
            apply filter
          </Button>
        </SheetClose>
      </SheetFooter>
    </ValidatedForm>
  );
}