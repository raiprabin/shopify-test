import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import {MetaFunction} from '@shopify/remix-oxygen';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {getAccessToken, isAuthenticate} from '~/lib/utils/auth-session.server';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  addProductToGroup,
  getPlaceAnOrderList,
  getProductGroupOptions,
} from '~/routes/_app.place-an-order.list/place-an-order-list.server';
import {DataTable} from '~/components/ui/data-table';
import {useMyProductColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {useTable} from '~/hooks/useTable';
import {renderSubComponent} from '~/routes/_app.cart-list/order-my-products/cart-myproduct';
import {ActionBar} from '~/routes/_app.place-an-order.list/action-bar';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {addedBulkCart} from '~/routes/_app.wishlist/bulk.cart.server';
import {Routes} from '~/lib/constants/routes.constent';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {SubmitPayload} from './save-later-dialogbox';
import {SelectProductProvider} from '../_app.pending-order_.$groupId/select-product-context';
import {RouteError} from '~/components/ui/route-error';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

const PAGE_LIMIT = 10;

type ActionType = 'add_to_cart';

export const meta: MetaFunction = () => {
  return [{title: 'Place an Order List'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const productGroupOptions = await getProductGroupOptions({customerId});

  const {searchParams} = new URL(request.url);

  const placeAnOrderList = await getPlaceAnOrderList({
    customerId,
    searchParams,
  });

  if (placeAnOrderList.totalProduct < 1) {
    return redirect(Routes.PLACE_AN_ORDER);
  }

  return json({productGroupOptions, placeAnOrderList});
}

export async function action({context, request}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const messageSession = await getMessageSession(request);

  const contentType = request.headers.get('Content-Type');

  if (contentType === 'application/json') {
    const jsonPayload = (await request.json()) as SubmitPayload;
    try {
      const response = await addProductToGroup({
        request,
        sumbitPayload: jsonPayload,
      });

      setSuccessMessage(messageSession, response?.message);

      return redirect(Routes.PENDING_ORDER, {
        headers: [['Set-Cookie', await messageCommitSession(messageSession)]],
      });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(messageSession, error?.message);
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      }
      setErrorMessage(
        messageSession,
        'Item not added to cart. Please try again later.',
      );
      return json(
        {},
        {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        },
      );
    }
  }

  const formData = await request.formData();

  const action = formData.get('_action') as ActionType;

  switch (action) {
    case 'add_to_cart': {
      try {
        const cartInfo = Object.fromEntries(formData);

        const accessTocken = (await getAccessToken(context)) as string;

        await addedBulkCart(cartInfo, context, accessTocken, request);

        setSuccessMessage(messageSession, 'Item added to cart successfully');

        return redirect(Routes.CART_LIST, {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        });
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(messageSession, error?.message);
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        }
        setErrorMessage(
          messageSession,
          'Item not added to cart. Please try again later.',
        );
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      }
    }

    default:
      throw new Error('Unexpected action');
  }
}

export default function PlaceAnOrderListPage() {
  const {productGroupOptions, placeAnOrderList} =
    useLoaderData<typeof loader>();

  const {columns} = useMyProductColumn({});

  const {table} = useTable(columns, placeAnOrderList.products, 'placeId');
  return (
    <section className="container data__table">
      <SelectProductProvider>
        <ActionBar table={table} productGroupOptions={productGroupOptions} />
      </SelectProductProvider>
      <DataTable
        table={table}
        columns={columns}
        renderSubComponent={renderSubComponent}
      />
      <PaginationWrapper
        pageSize={PAGE_LIMIT}
        totalCount={placeAnOrderList.totalProduct}
      />
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <RouteError />;
  } else if (error instanceof Error) {
    return <RouteError errorMessage={error.message} />;
  } else {
    return <h1>{DEFAULT_ERRROR_MESSAGE}</h1>;
  }
}
