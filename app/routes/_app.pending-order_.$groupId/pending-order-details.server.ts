import {useFetch} from '~/hooks/useFetch';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {BulkOrderColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

export type Product = BulkOrderColumn;

interface DefaultResponse {
  status: boolean;
  message: string;
}

type Group = {
  groupName: string;
  groupId: number;
  totalProduct: number;
  products: Product[];
};

interface GetProductGroupResponse extends DefaultResponse {
  payload: Group;
}

export async function getGroupDetails({
  groupId,
  customerId,
}: {
  groupId: string;
  customerId: string;
}) {
  try {
    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}?groupId=${groupId}`;

    const results = await useFetch<GetProductGroupResponse>({url});

    if (!results.status) {
      throw new Error(results.message);
    }
    return results.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}

export async function updateGroupDetails({
  groupId,
  groupName,
  customerId,
}: {
  groupId: number;
  groupName: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

  const body = JSON.stringify({groupId, groupName});

  const response = await useFetch<DefaultResponse>({
    url,
    method: AllowedHTTPMethods.PUT,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}

export async function deleteGroupProduct({
  body,
  customerId,
}: {
  body: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

  const response = await useFetch<DefaultResponse>({
    method: AllowedHTTPMethods.DELETE,
    url,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}
