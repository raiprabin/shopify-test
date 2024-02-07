import {AppLoadContext} from '@shopify/remix-oxygen';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

type LoginParams = {
  email: string;
  password: string;
  context: AppLoadContext;
};

type CustomerAddress = {
  address1: string;
};

type Metafield = {
  id: string;
  key: string;
  value: string;
  type: string;
};

export type CustomerData = {
  meta: Record<string, Metafield>;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: CustomerAddress[];
};

type CustomerResponse = {
  status: boolean;
  message: string;
  payload: CustomerData;
};

export function isUserActive(status: Metafield) {
  return status?.value === 'true';
}

export async function getCustomerByEmail({email}: {email: string}) {
  const customerResponse = await useFetch<CustomerResponse>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.CUSTOMER.GET}?email=${email}`,
  });

  if (!customerResponse.status) {
    throw new Error(customerResponse.message);
  }

  return customerResponse.payload;
}

export async function verifyLogin({email, password, context}: LoginParams) {
  const {storefront} = context;

  const {customerAccessTokenCreate} = await storefront.mutate(LOGIN_MUTATION, {
    variables: {
      input: {email, password},
    },
  });

  if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
  }

  const {customerAccessToken} = customerAccessTokenCreate;

  return customerAccessToken;
}

const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;