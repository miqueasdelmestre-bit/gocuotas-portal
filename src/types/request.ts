export interface CommercialConditionRequestInput {
  cuit: string;
  email: string;
  planId: string;
  acceptsCommercialConditions: boolean;
  commitsToCommunicateConditions: boolean;
}

export interface CommercialConditionRequestResult {
  success: boolean;
  submittedAt: string;
}
