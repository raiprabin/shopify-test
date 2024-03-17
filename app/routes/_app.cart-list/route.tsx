import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {getAccessToken, isAuthenticate} from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {getAllCompanyShippingAddresses} from '../_app.shipping-address/shipping-address.server';
import {removeItemFromCart} from './cart-remove.server';
import {getCartList} from './cart.server';
import MyProducts from './order-my-products/cart-myproduct';
import {placeOrder} from './order-place.server';
import OrderSummary from './order-summary/cart-order-summary';
import {addProductToCart} from '../_app.product_.$productSlug/product.server';

export const loader = async ({context, request}: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const {userDetails} = await getUserDetails(request);

  const metaParentValue = userDetails.meta.parent.value;

  const customerId =
    metaParentValue === 'null' ? userDetails.id : metaParentValue;
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

  if (!sessionCartInfo) {
    throw new Error('Cart not found');
  }
  const cartList = await getCartList(context, request, sessionCartInfo);
  const shippingAddresses = await getAllCompanyShippingAddresses(customerId);
  return json({cartList, shippingAddresses});
};

export async function action({request, context}: ActionFunctionArgs) {
  const messageSession = await getMessageSession(request);
  const formData = await request.formData();
  const UOMS = formData.getAll('uomSelector');
  const finalQuantity = formData.getAll('quantity');
  const productCode = formData.getAll('productCode');
  const productVarient = formData.getAll('productVarient');
  try {
    let res;
    switch (request.method) {
      case 'POST':
        try {
          res = await placeOrder(request, context);
          setSuccessMessage(messageSession, 'Order placed successfully');
          return redirect('/order-successful', {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          });
        } catch (error) {
          if (error instanceof Error) {
            console.log('this is err', error?.message);
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
          console.log('this is err');
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
          await getCartList(context, request, res.cartSession);
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
            console.log('this is err', error?.message);
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
          console.log('this is err');
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
        const formData = [];
        for (let i = 0; i < UOMS.length; i++) {
          const selectUOM = UOMS[i];
          const quantity = finalQuantity[i];
          const productId = productCode[i];
          const productVeriantId = productVarient[i];
          formData.push({
            quantity,
            selectUOM,
            productId,
            productVeriantId,
          });
        }
        console.log('putNowNow', formData);
        const accessTocken = (await getAccessToken(context)) as string;
        // const cartInfo = Object.fromEntries(formData);
        await addProductToCart(formData[0], accessTocken, context, request);
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
  } catch (error) {
    if (error instanceof Error) {
      console.log(' errerdf ', error?.message);
    }
    console.log(' errerdf ');
  }

  return {};
}

export default function CartList() {
  const {cartList, shippingAddresses}: any = useLoaderData<typeof loader>();

  return (
    <>
      <HeroBanner
        image_url={'/place-order.png'}
        section_name={'SHOPPING CART'}
      />
      <UploadSearchbar />
      <div className="container flex flex-col items-start justify-between gap-6 my-6 lg:flex-row">
        <MyProducts products={cartList?.productList} />
        <OrderSummary
          cartSubTotalPrice={cartList?.cartSubTotalPrice}
          cartTotalPrice={cartList?.cartTotalPrice}
          frieght={cartList?.frieght}
          subcharges={cartList?.subcharges}
          gst={cartList?.gst}
          shippingAddresses={shippingAddresses}
        />
      </div>
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
        <div className="min-h-[400px] flex justify-center items-center ">
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
