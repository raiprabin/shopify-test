import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import { AppLoadContext } from '@shopify/remix-oxygen';
import {
  PredictiveCollectionFragment,
  PredictiveProductFragment,
  PredictiveQueryFragment,
  PredictiveSearchQuery,
} from 'storefrontapi.generated';
import { getAccessToken, isAuthenticate } from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { addProductToCart } from '../_app.product_.$productSlug/product.server';
import { getCartList } from '../_app.cart-list/cart.server';
import { CART_SESSION_KEY } from '~/lib/constants/cartInfo.constant';
import { getPrices } from '../_app.category_.$mainCategory.$categoryId_.$subCategoryId/product-list.server';
import { getUserDetails } from '~/lib/utils/user-session.server';

type PredicticeSearchResultItemImage =
  | PredictiveCollectionFragment['image']
  | PredictiveProductFragment['variants']['nodes'][0]['image'];

export type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  image?: PredicticeSearchResultItemImage;
  styledTitle?: string;
  title: string;
  url: string;
  moq: string;
  sku: string;
  price: string;
  currency: string;
  uom: string;
  uomCode: string;
  variantId: string;
  unitOfMeasure: { unit: string; code: string; conversionFactor: number }[];
  defaultUomValue: string;
};

type NormalizedPredictiveSearchResults = Array<
  | { type: 'queries'; items: Array<NormalizedPredictiveSearchResultItem> }
  | { type: 'products'; items: Array<NormalizedPredictiveSearchResultItem> }
>;

export type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults;
};

const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = [
  { type: 'queries', items: [] },
  { type: 'products', items: [] },
];

/**
 *
 * @description normalize the predictive search results
 * @param predictiveSearch
 */
async function normalizePredictiveSearchResults(
  predictiveSearch: PredictiveSearchQuery['predictiveSearch'],
  customerId: string,
): Promise<NormalizedPredictiveSearch> {
  const results: NormalizedPredictiveSearchResults = [];

  if (!predictiveSearch) {
    return {
      results: NO_PREDICTIVE_SEARCH_RESULTS,
    };
  }

  if (predictiveSearch.products.length) {
    const prices = await formattedProductPrice(
      predictiveSearch.products,
      customerId,
    );

    results.push({
      type: 'products',
      items: predictiveSearch.products.map(
        (product: PredictiveProductFragment) => {
          const productId = product?.id.replace('gid://shopify/Product/', '');
          const variantId = product?.variants?.nodes[0]?.id.replace(
            'gid://shopify/ProductVariant/',
            '',
          );

          return {
            __typename: product.__typename,
            handle: product.handle,
            id: productId,
            image: product.variants?.nodes?.[0]?.image,
            variantId: variantId,
            title: product.title,
            //@ts-ignore
            uom: product?.uom?.value,
            url: '',
            currency: prices?.[productId] ? prices?.[productId]?.currency : '$',
            price: prices?.[productId]
              ? prices?.[productId]?.company_price
              : null,
            //@ts-ignore
            sku: product.variants.nodes[0]?.sku,
            //@ts-ignore
            moq: product.variants.nodes[0]?.moq?.value,
            unitOfMeasure: prices?.[productId]?.unitOfMeasure,
            uomCode: prices?.[productId]?.uomCode,
            defaultUomValue: prices?.[productId]?.uom,
          };
        },
      ),
    });
  }

  return { results };
}

const formattedProductPrice = async (
  predictiveSearchData: PredictiveProductFragment[],
  customerId: string,
) => {
  let productIds = '';
  predictiveSearchData.map((items: PredictiveProductFragment) => {
    const productId = items?.id.replace('gid://shopify/Product/', '');
    if (!productIds) {
      productIds = productId;
    } else {
      productIds += `,${productId}`;
    }
    return true;
  });

  const priceList = await getPrices(productIds, customerId);

  return priceList;
};

async function getSearchProduct({
  limit = 6,
  context,
  searchTerm,
  customerId,
}: {
  searchTerm: string;
  context: AppLoadContext;
  limit?: number;
  customerId: string;
}) {
  const searchData: PredictiveSearchQuery = await context.storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        limit,
        limitScope: 'EACH',
        searchTerm,
        types: ['PRODUCT', 'QUERY'],
      },
    },
  );

  if (!searchData) {
    throw new Error('No data returned from Shopify API');
  }

  const { results } = await normalizePredictiveSearchResults(
    searchData.predictiveSearch,
    customerId,
  );

  return results;
}

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { searchParams } = new URL(request.url);
  const { userDetails } = await getUserDetails(request);
  const searchTerm = searchParams.get('searchTerm');
  if (searchTerm) {
    const results = await getSearchProduct({
      searchTerm,
      context,
      customerId: userDetails?.id,
    });

    return json({ results });
  }
  return null;
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  const fromData = await request.formData();
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);
  try {
    const cartInfo = Object.fromEntries(fromData);
    const accessTocken = (await getAccessToken(context)) as string;
    const addToCart = await addProductToCart(
      cartInfo,
      accessTocken,
      context,
      request,
    );
    await getCartList(context, request, sessionCartInfo);
    setSuccessMessage(messageSession, 'Item added to cart successfully');
    return redirect('/cart-list', {
      headers: [
        ['Set-Cookie', await context.session.commit({})],
        ['Set-Cookie', await messageCommitSession(messageSession)],
      ],
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log('this is err', error?.message);
      setErrorMessage(messageSession, error?.message);
      return redirect('/cart-list', {
        headers: [
          ['Set-Cookie', await context.session.commit({})],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      });
    }
    console.log('this is err');
    setErrorMessage(
      messageSession,
      'Item not added to cart. Please try again later.',
    );
    return redirect('/cart-list', {
      headers: [
        ['Set-Cookie', await context.session.commit({})],
        ['Set-Cookie', await messageCommitSession(messageSession)],
      ],
    });
  }
};

const PREDICTIVE_SEARCH_QUERY = `#graphql
  fragment PredictiveProduct on Product {
  __typename
  id
  title
  handle
  trackingParameters
  uom : metafield(namespace: "uom", key: "uom") { value }
  collections(first: 10) {
    nodes {
      id
      handle
      parent_handle: metafield(namespace: "parent", key: "parent_slug") {
        value
      }
    }
  }
  variants(first: 1) {
    nodes {
      id
      sku
      moq : metafield( namespace: "moq", key: "moq" ) { value }
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
}

fragment PredictiveQuery on SearchQuerySuggestion {
  __typename
  text
  styledText
  trackingParameters
}

query predictiveSearch($limit: Int!, $limitScope: PredictiveSearchLimitScope!, $searchTerm: String!, $types: [PredictiveSearchType!]) {
  predictiveSearch(
    limit: $limit
    limitScope: $limitScope
    query: $searchTerm
    types: $types
    searchableFields:[VARIANTS_SKU,TITLE,VARIANTS_TITLE]
  ) {
    products {
      ...PredictiveProduct
    }
    queries {
      ...PredictiveQuery
    }
  }
}
` as const;