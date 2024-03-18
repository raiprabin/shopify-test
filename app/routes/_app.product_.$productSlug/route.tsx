import { json, useLoaderData } from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';
import { ReactNode } from 'react';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { CART_SESSION_KEY } from '~/lib/constants/cartInfo.constant';
import { getAccessToken } from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { GET_CART_LIST } from '../_app.cart-list/cart.server';
import { addProductToCart, getProductDetails } from './product.server';
import ProductInformation from './productInformation';
import ProductTab from './productTabs';
import ProductsRelatedProduct from './productsRelatedProduct';
import { addToWishlist, removeFromWishlist } from './wishlist.server';
import { WISHLIST_SESSION_KEY } from '~/lib/constants/wishlist.constant';

export type SimilarProduct = {
  name: string;
  imageUrl: string;
  isFavorited: boolean;
  isQtyBuyAvailable: boolean;
  productBuyPrice: number;
  productRRP: number;
  sku: string;
};

export type Product = {
  title: string;
  isFavorited: boolean;
  productBuyPrice: number;
  productRRP: number;
  supplierSku: string;
  unitOfMeasurement: string;
  uom: string;
  isInStock: boolean;
  unitOfMeasure: {
    unit: string;
    conversion_factor: number;
  }[];
  bulkPricings: {
    quantity: string;
    price: number;
  }[];
  pickUpLocation: string;
  pickUpReadyTime: string;
  similarProducts: SimilarProduct[];
};

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  try {
    const { productSlug } = params;
    const sessionCartInfo = await context.session.get(CART_SESSION_KEY);
    const sessionWishListInfo = await context.session.get(WISHLIST_SESSION_KEY);
    if (sessionCartInfo) {
      const cartLists = await context.storefront.query(GET_CART_LIST, {
        variables: { cartId: sessionCartInfo?.cartId },
      });
    }
    const { userDetails } = await getUserDetails(request);
    const product = await getProductDetails(
      userDetails?.id,
      productSlug as string,
    );

    const productPage = params.productSlug;

    return json({
      product,
      productPage,
      sessionWishListInfo
    });
  } catch (error) {
    console.log('first', error);
    return json({});
  }
};

export default function route() {
  const { product, productPage, sessionWishListInfo } = useLoaderData<typeof loader>();
  return (
    <ProductDetailPageWrapper>
      <div className="flex items-center pt-6 pb-4 ">
        <BackButton title="" />
        <Breadcrumb>
          <BreadcrumbItem href="/categories" className="capitalize">
            Product
          </BreadcrumbItem>
          <BreadcrumbItem className="capitalize text-grey-800">
            {productPage?.split('-').join(' ')}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <ProductInformation product={product} wishListItems={sessionWishListInfo?.wishItems} />
      <ProductTab description={product?.description} />
      <ProductsRelatedProduct />
    </ProductDetailPageWrapper>
  );
}

const ProductDetailPageWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="container">{children}</div>;
};

export const action = async ({
  request,
  context,
}: ActionFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  const fromData = await request.formData();
  switch (fromData.get("action")) {
    case "addToCart": {
      try {
        const cartInfo = Object.fromEntries(fromData);
        const accessTocken = (await getAccessToken(context)) as string;
        const addToCart = await addProductToCart(
          cartInfo,
          accessTocken,
          context,
          request,
        );
        setSuccessMessage(messageSession, 'Item added to cart successfully');
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
    case "addToWishList": {
      try {
        const productInfo = Object.fromEntries(fromData);
        console.log("productInfo", productInfo)
        await addToWishlist(productInfo, context, request);
        setSuccessMessage(messageSession, 'Item added to wishlist successfully');
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
          'Item not added to wishlist. Please try again later.',
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
    case "removeFromWishList": {
      try {
        const productInfo = Object.fromEntries(fromData);
        await removeFromWishlist(productInfo, context, request);
        setSuccessMessage(messageSession, 'Item removed from wishlist successfully');
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
          'Item not removed from the wishlist. Please try again later.',
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
    default: {
      throw new Error("Unknown action");
    }
  }
};
