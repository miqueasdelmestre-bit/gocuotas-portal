import type { StructuredAddress } from "@/types/address";

export interface PhysicalMaterialRequestInput {
  cuit: string;
  contactName: string;
  phone: string;
  email: string;
  materialType: string;
  notes?: string;
  address: StructuredAddress;
  addressDetail?: string;
}

export interface PhysicalMaterialRequestResult {
  success: boolean;
  submittedAt: string;
}
