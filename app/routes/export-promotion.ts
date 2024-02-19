import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {isAuthenticate} from '~/lib/utils/authsession.server';

export async function exportPromotion(request: Request) {
  const searchParams = new URL(request.url).search;

  const url = `${ENDPOINT.PROMOTION.BULK_EXPORT}${searchParams}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const contentType = response.headers.get('content-type');

    let fileData: ArrayBuffer | Blob;

    if (contentType && contentType === 'application/zip') {
      const buffer = await response.arrayBuffer();
      fileData = buffer;
    } else if (contentType && contentType === 'application/octet-stream') {
      const blob = await response.blob();
      fileData = blob;
    } else {
      throw new Error('Unexpected content type');
    }
    return fileData;
  } catch (error) {
    console.error('Error downloading images:', error);
  }
}

export async function loader({request, context}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const file = await exportPromotion(request);

  const fileName = file instanceof Blob ? 'promotion.png' : 'promotion.zip';

  return new Response(file, {
    headers: {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': 'application/octet-stream',
    },
  });
}
