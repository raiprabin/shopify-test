import {AppLoadContext} from '@shopify/remix-oxygen';
import {customerRecover} from '~/routes/_public.forget-password/forget-password.server';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {fileUpload} from '~/lib/utils/file-upload';
import {CustomerResponse} from '~/routes/_app.team_.$teamId/edit-team.server';
import {getUserDetails} from '~/lib/utils/user-session.server';

type AddTeamParams = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  context: AppLoadContext;
  userRole: string;
  file: File | any;
  request: Request;
};

export async function addTeam({
  address,
  context,
  file,
  email,
  fullName,
  userRole,
  phoneNumber,
  request,
}: AddTeamParams) {
  const {storefront}  = context;
  const {userDetails} = await getUserDetails(request);

  const companyId = userDetails.meta.company_id.value;
  const customerId = userDetails?.id
  const metaParentValue = userDetails.meta.parent.value;

  const parentId =
    metaParentValue === 'null' ? customerId : metaParentValue;
  
  const formData : any = new FormData()
  formData.append("fullName", fullName)
  formData.append("profileImage", file )
  formData.append("email", email)
  formData.append("address", address)
  formData.append("userRole", userRole)
  formData.append("phoneNumber", phoneNumber)
  formData.append("customerId", customerId)
  formData.append("parentId", parentId)
  formData.append("companyid", companyId)

  const results: any = await fetch(
    ENDPOINT.CUSTOMER.CREATE,
    {
      method: AllowedHTTPMethods.POST,
      body: formData,
    },
  );

  const response = await results.json()

  if( response?.error ) {
    throw new Error("Customer not created")
  }

  if( !response?.status ) {
    throw new Error(response?.message)
  }

  // if (!results.status) throw new Error("Couldn't create user");

  return response;
}

const CREATE_TEAM_MUTATION = `#graphql 
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
       id
    }
    customerUserErrors {
      field
      message
    }
  }
}
` as const;
