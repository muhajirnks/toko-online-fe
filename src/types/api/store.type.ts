export interface CreateStoreRequest {
    name: string;
    description?: string;
    avatar?: File | null;
}

export interface UpdateStoreRequest extends Partial<CreateStoreRequest> {}
