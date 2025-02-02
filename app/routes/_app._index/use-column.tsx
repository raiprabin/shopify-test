import {ColumnDef} from '@tanstack/react-table';
import {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {DownloadIcon} from '~/components/icons/download-icon';
import {EyeOn} from '~/components/icons/eye';
import {Button} from '~/components/ui/button';
import Loader from '~/components/ui/loader';
import {OrderStatusChip} from '~/components/ui/order-status-chip';
import {useDownload} from '~/hooks/useDownload';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {PDF} from '~/lib/constants/pdf.constent';
import {Routes} from '~/lib/constants/routes.constent';
import {formatDateToLocaleDateString} from '~/lib/helpers/dateTime.helper';
import {Invoices} from '~/routes/_app.invoices/invoices.server';

export function useSpendingByProductColumn(
  currency: string,
  currencySymbol: string,
) {
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'productName',
        header: 'Product name',
        enableSorting: false,
        cell: (info) => {
          const product = info?.row?.original;
          const productSlug = product?.handle;
          return (
            <div className="flex items-center gap-x-3">
              <div className="h-12 aspect-square">
                <img
                  src={
                    product?.featuredImage
                      ? product?.featuredImage
                      : DEFAULT_IMAGE.IMAGE
                  }
                  alt={product?.product_name}
                  className="object-contain w-full h-full"
                />
              </div>
              <Link to={productSlug ? 'product/' + productSlug : ''}>
                <p>{product?.product_name}</p>
              </Link>
            </div>
          );
        },
      },
      {
        accessorKey: 'date',
        header: 'Recent Purchased Date',
        enableSorting: false,
        cell: (info) => {
          const product = info?.row?.original;
          return (
            <p>
              {product?.recent_purchase_date
                ? formatDateToLocaleDateString(product?.recent_purchase_date)
                : 'N/A'}
            </p>
          );
        },
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        enableSorting: false,
        cell: (info) => {
          const product = info?.row?.original;
          return <p>{product?.quantity ? product?.quantity : 'N/A'}</p>;
        },
      },
      {
        accessorKey: 'spending',
        header: 'Total Spending',
        enableSorting: false,
        cell: (info) => {
          const product = info?.row?.original;
          return (
            <p>
              {currency && currency}&nbsp;{currencySymbol && currencySymbol}
              {product?.total_spending
                ? product?.total_spending.toFixed(2)
                : 'N/A'}
            </p>
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        enableSorting: false,
        cell: (info) => {
          const productSlug = info?.row?.original?.handle;
          return (
            <div className="flex justify-start gap-x-2">
              <Link to={productSlug ? 'product/' + productSlug : ''}>
                <Button size="icon" variant="icon">
                  <EyeOn />
                </Button>
              </Link>
            </div>
          );
        },
      },
    ],
    [],
  );

  return {columns};
}

export function useColumn(
  sessionAccessTocken: string,
  impersonateEnableCheck: string,
) {
  const columns = useMemo<ColumnDef<Invoices>[]>(
    () => [
      {
        accessorKey: 'invoiceId',
        header: 'Invoice No.',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'invoiceDate',
        header: 'Date',
        enableSorting: false,
        cell: (info) =>
          info.getValue()
            ? formatDateToLocaleDateString(info.getValue() as string)
            : 'N/A',
      },
      {
        accessorKey: 'invoiceAmount',
        header: 'Invoice Amount',
        enableSorting: false,
        cell: (info) => {
          return info.getValue()
            ? (info.row.original.currency ?? '') +
                ' ' +
                (info.row.original.currencySymbol ?? '') +
                info.getValue()
            : 'N/A';
        },
      },
      {
        accessorKey: 'invoiceStatus',
        header: 'Invoice Status',
        enableSorting: false,
        cell: (info) => {
          const status = info.row.original.invoiceStatus;
          return <OrderStatusChip status={status} />;
        },
      },
      {
        accessorKey: 'actions',
        header: 'View Invoice',
        enableSorting: false,
        cell: (info) => {
          const invoiceId = info.row.original.invoiceId;
          const fileURL = info.row.original.files;
          const invoiceDetailsRoute = `${Routes.INVOICES}/${invoiceId}`;

          const {handleDownload, loading} = useDownload();

          return (
            <div className="flex justify-start gap-x-2">
              <Link to={invoiceDetailsRoute}>
                <Button size="icon" variant="icon">
                  <EyeOn />
                </Button>
              </Link>
              <Button
                size="icon"
                variant="icon"
                className={`${loading && 'pointer-events-none'}`}
                onClick={() =>
                  handleDownload({
                    url: fileURL,
                    headers: {
                      apiKey: PDF.SECRET_KEY,
                      Authorization: sessionAccessTocken,
                      'Impersonate-Enable': impersonateEnableCheck,
                    },
                  })
                }
              >
                {loading ? <Loader /> : <DownloadIcon />}
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  return {columns};
}
