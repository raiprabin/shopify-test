import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {removeCart} from './order-place.server';
import {getCartList} from './cart.server';
import {useFormatCart} from '~/hooks/useFormatCart';
import {emitter3} from '~/lib/utils/emitter.server';
import {EVENTS} from '~/lib/constants/events.contstent';
import {getUserDetails} from '~/lib/utils/user-session.server';
import { USER_SESSION_ID } from '~/lib/utils/auth-session.server';
import { promoCodeRemove } from './promoCodeRemove.server';

export const removeItemFromCart = async (
  formData: any,
  context: any,
  request: Request,
) => {
  const {userDetails} = await getUserDetails(request);
  
  const { session } = context;

  const itemList = Object.fromEntries(formData);
  const lineItemId = Object.keys(itemList)
    .filter((key) => key !== 'action')
    .map((key) => itemList[key]) as any;

  if (lineItemId?.length < 1) {
    throw new Error('Cart item not provided');
  }

  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);
  const userSessionId = session.get(USER_SESSION_ID);

  if (!sessionCartInfo) {
    throw new Error('Cart not found');
  }
  const cartRemoveResponse = await removeCart(
    lineItemId,
    context,
    sessionCartInfo,
    true,
  );
  const cartSession = {
    ...sessionCartInfo,
    cartItems: [],
    lineItems: cartRemoveResponse,
  };
  const finalCartSession = useFormatCart(cartSession);
  context.session.set(CART_SESSION_KEY, finalCartSession);
  await getCartList(context, request, cartSession);
  await promoCodeRemove(request);

  //this is use to emit notification for the cart on
    emitter3.emit(EVENTS.NOTIFICATIONS_UPDATED.KEY, {
      payload: {
        type: 'cart',
        totalNumber: cartRemoveResponse,
        customerId: userDetails.id,
        sessionId: userSessionId
      },
    });

  return {cartSession};
};
