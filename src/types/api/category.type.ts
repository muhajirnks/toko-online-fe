export interface Category {
    _id: string;
    name: string;
    description: string;
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}