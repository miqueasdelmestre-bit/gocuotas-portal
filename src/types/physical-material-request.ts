import type { StructuredAddress } from "@/types/address";

export interface PhysicalMaterialRequestInput {
  brandName: string;
  cuit: string;
  email: string;
  phone: string;
  address: StructuredAddress;
  branchCount: number;
  floorOrUnit?: string;
}

export interface PhysicalMaterialRequestResult {
  success: boolean;
  submittedAt: string;
}
