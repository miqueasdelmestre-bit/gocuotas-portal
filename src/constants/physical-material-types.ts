export interface PhysicalMaterialTypeOption {
  value: string;
  label: string;
}

export const PHYSICAL_MATERIAL_TYPES: PhysicalMaterialTypeOption[] = [
  { value: "cartel-vidriera", label: "Cartel para vidriera" },
  { value: "banner", label: "Banner / pie de cartel" },
  { value: "stickers", label: "Stickers para mostrador" },
  { value: "folleteria", label: "Folletería" },
  { value: "otro", label: "Otro" },
];
