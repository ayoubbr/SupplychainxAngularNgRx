export interface SupplyOrder {
  id: number;
  date: string;
  status: string;
  supplier: Supplier;
  rawMaterials: RawMaterialQuantity[];
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  rating: number;
  leadTime: number;
}

export interface RawMaterialQuantity {
  id: number;
  name: string;
  quantity: number;
}
