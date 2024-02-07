export interface SliderType {
  node: Node;
}

export interface Node {
  type: string;
  slider_title: SliderTitle;
  slider_image: SliderImage;
}

export interface SliderImage {
  reference: Reference;
}

export interface Reference {
  previewImage: PreviewImage;
}

export interface PreviewImage {
  url: string;
}

export interface SliderTitle {
  value: string;
}

export async function getSlides({context}: any) {
  const {storefront} = context;
  try {
    const response = await storefront.query(SLIDER_DATA_QUERY);
    const sliderList = response?.metaobjects?.edges;
    if (sliderList.length < 1) {
      throw new Error(response?.message);
    }
    return formattedResponse(sliderList);
  } catch (e) {
    if (e instanceof Error) {
      return [];
    }
    return [];
  }
}

const formattedResponse = (response: SliderType[]) => {
  const data = response.map((item) => ({
    image: item?.node?.slider_image?.reference?.previewImage?.url,
  }));

  return data;
};

const SLIDER_DATA_QUERY = `query getHomepageSlider {
  metaobjects(type : "cigweld_home_page_slider", first: 10) {
    edges {
        node {
            type
            slider_title: field(key: "title") { value }
            slider_image: field(key: "image_url") { 
                reference {
                    ... on MediaImage {
                        previewImage {
                            url
                        }
                    }
                } 
            }
        }
    }
  }
}` as const;