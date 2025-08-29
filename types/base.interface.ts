export interface IBase {
    id?: string
    createdAt?: Date
    createdBy?: string
    updatedAt?: Date
    updatedBy?: string
}
export interface IBaseFilters {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export type MutationMode = "create" | "update" | "delete" | "view"