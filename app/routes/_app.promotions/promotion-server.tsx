export interface PromotionsResponse {
  status: boolean;
  message: string;
  payload: PromotionsResponsePayload[];
}

export interface PromotionsResponsePayload {
  id: number;
  image_url: string;
  title: string;
  logo_url: string;
  company_name: string;
  company_id: string;
  compnay_email: string;
  company_domain: string;
  company_fax: string;
  color: string;
  background_color: string;
  created_by: string;
  expaire_at: string;
  create_at: string;
  updated_at: string;
}
