import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {TeamColumn} from './use-column';

interface MetaField {
  key: string;
  value: string;
}

export interface Customer {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  metafields: {
    nodes: MetaField[];
  };
}

interface ResponseData {
  status: boolean;
  message: string;
  payload: TeamColumn[];
}

export async function getAllTeams({
  companyId,
  query,
}: {
  companyId: string;
  query: string | null;
}) {
  const results = await useFetch<ResponseData>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.CUSTOMER_LIST.GET}?company_id=${companyId}${
      query ? '&search_query=' + query : ''
    }`,
  });

  if (!results.status) {
    throw new Error(results.message);
  }

  console.log('payload', results.payload);

  return results.payload;
}

export async function updateStatus({
  customerId,
  value,
}: {
  customerId: string;
  value: 'true' | 'false';
}) {
  const body = JSON.stringify({
    customerId,
    status: value,
  });

  const results = await useFetch<ResponseData>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.CUSTOMER.PUT,
    body,
  });

  if (!results.status) {
    throw new Error(results.message);
  }

  console.log({results});
}