import React from "react"

export type MarkDownEditProps = {
    selectedTask: {
        id:string,
        name: string, 
        categories: string,
        subcategories?: string,
        price: number,
        volume:string,
        image: string,
        available: boolean
    },
    setIsEditing: (isEditing: boolean) => void,
    handleDelete: () => void
}

export type MarkDownProps = {
    editedData: {
        id:string,
        name: string, 
        categories: string,
        subcategories?: string,
        price: number,
        volume:string,
        image: string,
        available: boolean
    },
    handleInputChange: (field: 'name' | 'categories' | 'subcategories' | 'price' | 'volume' | 'image' | 'available', value: string) => void,
    handleSave: () => void,
    setIsEditing: (isEditing: boolean) => void
}

export type SearchInputProps = {
    searchTerm: string,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}