export interface StructuredAddress {
  formattedAddress: string;
  street?: string;
  streetNumber?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
}
