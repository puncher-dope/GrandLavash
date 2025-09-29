import { HandleInputChange } from "./productEditorType";

export interface MarkDownProps {
  handleInputChange: HandleInputChange;
  handleSave: () => void;
  setIsEditing: (editing: boolean) => void;
}

export interface MarkDownEditProps {
  selectedProduct: {
        _id:string,
        name: string, 
        categories: string,
        subcategories?: string,
        price: number,
        description: string
        volume:string,
        image: string,
        available: boolean
    };
  setIsEditing: (editing: boolean) => void;
  handleDelete: () => void;
}

export type SearchInputType = {
    searchTerm: string,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}