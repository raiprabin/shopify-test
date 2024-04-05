import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import { useState } from 'react';
import EmptyList from '~/components/ui/empty-list';
import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import { CART_SESSION_KEY } from '~/lib/constants/cartInfo.constant';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getAllCompanyShippingAddresses } from '../_app.shipping-address/shipping-address.server';
import { removeItemFromCart } from './cart-remove.server';
import { cartUpdate } from './cart-update.server';
import { getCartList } from './cart.server';
import MyProducts from './order-my-products/cart-myproduct';
import { placeOrder } from './order-place.server';
import OrderSummary from './order-summary/cart-order-summary';
import useSort from '~/hooks/useSort';

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);

  const metaParentValue = userDetails.meta.parent.value;

  const customerId =
    metaParentValue === 'null' ? userDetails.id : metaParentValue;
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

  if (!sessionCartInfo) {
    throw new Error('Cart not found');
  }
  const shippingAddresses = await getAllCompanyShippingAddresses(customerId);
  const cartList = await getCartList(context, request, sessionCartInfo);
  if (cartList?.productList?.length === 0) {
    await getCartList(context, request, sessionCartInfo)
  }
  return json(
    { cartList, shippingAddresses },
    {
      headers: [['Set-Cookie', await context.session.commit({})]],
    },
  );
};

export async function action({ request, context }: ActionFunctionArgs) {
  const messageSession = await getMessageSession(request);
  let res;
  switch (request.method) {
    case 'POST':
      try {
        res = await placeOrder(request, context);
        // console.log("orderPlacedResponseFInal", res);
        const shopifyID = res?.shopifyOrderId ? "/" + res?.shopifyOrderId : '';
        setSuccessMessage(messageSession, 'Order placed successfully');
        return redirect(Routes.ORDER_SUCCESSFUL + shopifyID, {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        });
      } catch (error) {
        if (error instanceof Error) {
          // console.log('this is err', error?.message);
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
        // console.log('this is err');
        setErrorMessage(
          messageSession,
          'Order not placed to some issue. Please try again later.',
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
    case 'DELETE':
      try {
        res = await removeItemFromCart(context, request);
        setSuccessMessage(messageSession, 'Order deleted successfully');
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          // console.log('this is err', error?.message);
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
        // console.log('this is err');
        setErrorMessage(
          messageSession,
          'Order not deleted due to some issue. Please try again later.',
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
    case 'PUT':
      try {
        res = await cartUpdate(context, request);
        setSuccessMessage(messageSession, 'Cart updated successfully');
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          // console.log('this is err', error?.message);
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
        // console.log('this is err');
        setErrorMessage(
          messageSession,
          'Something went wrong during update cart. Please try again later.',
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
    default:
      res = json(
        {
          status: false,
          message: `${request.method} not supported`,
          payload: null,
        },
        404,
      );
  }
}

export default function CartList() {
  const { cartList, shippingAddresses }: any = useLoaderData<typeof loader>();
  const [updateCart, setUpdateCart] = useState(false);
  const [placeOrder, setPlaceOrder] = useState(true);
  const finalProductList = useSort({ items: cartList?.productList });

  return (
    <>
      <HeroBanner imageUrl={'/place-order.png'} sectionName={'SHOPPING CART'} />
      <UploadSearchbar searchVariant="cart" />
      {finalProductList?.length === 0 ?
        <EmptyList /> :
        <div className="container flex flex-col items-start justify-between gap-6 my-6 lg:flex-row">
          <MyProducts
            products={finalProductList}
            currency={cartList?.currency}
            updateCart={updateCart}
            setUpdateCart={setUpdateCart}
            setPlaceOrder={setPlaceOrder}
          />
          <OrderSummary
            cartSubTotalPrice={cartList?.cartSubTotalPrice}
            cartTotalPrice={cartList?.cartTotalPrice}
            freight={cartList?.freight}
            surcharges={cartList?.surcharges}
            gst={cartList?.gst}
            currency={cartList?.currency}
            shippingAddresses={shippingAddresses}
            updateCart={updateCart}
            placeOrder={placeOrder}
          />
        </div>
      }
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="container pt-6">
        <div className="min-h-[400px] flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <h3>Error has occured</h3>
            <p className="leading-[22px] text-lg text-grey uppercase font-medium text-red-500">
              {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
