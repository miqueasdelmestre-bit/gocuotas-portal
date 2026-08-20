import type { StructuredAddress } from "@/types/address";

export interface PhysicalMaterialRequestInput {
  brandName: string;
  cuit: string;
  email: string;
  phone: string;
  address: StructuredAddress;
  branchCount: number;
  floorOrUnit?: string;
  /** utm_source de la URL con la que llegó al formulario (ej. "panel", "correorepo"). */
  utmSource?: string;
}

export interface PhysicalMaterialRequestResult {
  success: boolean;
  submittedAt: string;
}
