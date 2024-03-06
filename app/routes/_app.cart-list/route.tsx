import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import MyProducts from './order-my-products/cart-myproduct';
import OrderSummary from './order-summary/cart-order-summary';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {getCartList} from './cart.server';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {useLoaderData} from '@remix-run/react';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {getAllCompanyShippingAddresses} from '../_app.shipping-address/shipping-address.server';
import {useTable} from '~/hooks/useTable';
import {useMyProductColumn} from './order-my-products/use-column';

export const loader = async ({context, request}: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const {userDetails} = await getUserDetails(request);

  const metaParentValue = userDetails.meta.parent.value;

  const customerId =
    metaParentValue === 'null' ? userDetails.id : metaParentValue;
  try {
    let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

    if (!sessionCartInfo) {
      throw new Error('Cart not found');
    }

    const cartList = await getCartList(context, request, sessionCartInfo);
    const shippingAddresses = await getAllCompanyShippingAddresses(customerId);
    // console.log(cartList)
    return json({cartList, shippingAddresses});
  } catch (error) {
    if (error instanceof Error) {
      console.log('error ', error?.message);
      return json({});
    }
    console.log('error generates ');
    return json({});
  }
};

export async function action({request}: ActionFunctionArgs) {
  let res;
  switch (request.method) {
    case 'POST':
      res = await placeOrder(request);
      break;
    case 'PUT':
      res = await request.formData();
      console.log('res', res);
      break;
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

const placeOrder = async (request: Request) => {
  try {
    const formData = await request.formData();
    console.log('res', formData);
    return {formData};
  } catch (error) {
    if (error instanceof Error) {
      console.log('err', error);
      return {};
    }
    return {};
  }
};
