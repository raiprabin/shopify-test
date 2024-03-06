import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Unpaid',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Unpaid',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Unpaid',
  },
];

export function BulkTable({
  quantity,
  price,
}: {
  quantity: string;
  price: string;
}) {
  return (
    <div className="flex w-full space-x-6">
      <Table className="min-w-[266px] border-[1px] border-grey-50 h-full transition-all duration-700 ease-in-out delay-200">
        <TableHeader>
          <TableRow className="bg-secondary-500 hover:bg-secondary-500">
            <TableHead className="text-base font-medium leading-[21px] text-grey-900 text-center">
              {quantity}
            </TableHead>
            <TableHead className="text-base font-medium leading-[21px] text-grey-900 text-center uppercase">
              {price}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice} className="hover:bg-white">
              <TableCell className="text-base font-medium leading-[21px] text-grey-900 text-center">
                {invoice.invoice}
              </TableCell>
              <TableCell className="text-base font-medium leading-[21px] text-grey-900 text-center">
                {invoice.paymentStatus}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
