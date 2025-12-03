
export interface ProductData {
  id: string;
  name: string;
  categories: string;
  subcategories: string;
  price: number;
  volume: string;
  image: string;
  available: boolean;
  description:string
}

export type ProductFieldValue = 
  | string 
  | number 
  | boolean 

export type HandleInputChange = <K extends keyof ProductData>(
  field: K, 
  value: ProductData[K]
) => void;

export type HandleInputChangeType = {
  handleInputChange: HandleInputChange
}

export interface ProductEditorType {
  isEditing?: boolean;
  setIsEditing: (editing: boolean) => void;
}


export type ProductListType = {
  searchTerm: string,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  currentCategory?:string
}