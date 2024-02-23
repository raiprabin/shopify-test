import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {PromotionType} from '../_app.customise_.$promotionId/promotion.server';

interface FormDataObject {
  [key: string]: string | Blob;
}

export const getMyPromotionById = async (promotionId: string) => {
  try {
    const results = await useFetch<PromotionType>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.PROMOTION.GET_MYPROMOTION}/${promotionId}`,
    });

    if (!results.status) {
      throw new Response(results.message, {
        status: 404,
      });
    }
    return results;
  } catch (error) {
    throw new Error(
      'Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.',
    );
  }
};

export async function updatePromotion(
  formData: FormDataObject,
  bannerId: string,
) {
  try {
    const fData = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      fData.append(key, value);
    }

    const results: any = await fetch(
      `${ENDPOINT.PROMOTION.GET_MYPROMOTION}/${bannerId}`,
      {
        method: 'PATCH',
        body: fData,
      },
    );
    if (!results.status) {
      throw new Response(results.message, {
        status: 404,
      });
    }
    return results;
  } catch (error) {
    throw new Error(
      'Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.',
    );
  }
}
