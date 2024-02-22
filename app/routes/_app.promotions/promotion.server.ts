import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export interface PromotionsResponse {
  status: boolean;
  message: string;
  payload: Payload;
}

export interface Payload {
  totalPromotions: number;
  promotions: Promotion[];
}

export interface Promotion {
  id: number;
  title: string;
  image_url: string;
}

export async function getPromotions({
  custom = false,
  filterBy,
  pageNumber,
  customerId,
  paramsList
}: {
  filterBy?: string | null;
  custom?: boolean;
  pageNumber?: number;
  customerId?: string
  paramsList?: any
}) {
  try {
    let url = `${ENDPOINT.PROMOTION.GET}/${customerId}?`;
    console.log("qwqweqwe ", url)
    if (paramsList?.filter_by) {
      url += `&filter_by=${paramsList?.filter_by}`;
    }
    if (custom) {
      url += '&custom_promotion=true';
    }

    if (paramsList?.page) {
      url += `&page=${paramsList?.page}`;
    }

    const response = await useFetch<PromotionsResponse>({
      method: AllowedHTTPMethods.GET,
      url: url,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    return {
      totalPromotionCount: response?.payload?.totalPromotions,
      promotions: response?.payload?.promotions,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}
