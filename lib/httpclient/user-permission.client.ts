import { IUser } from "@/types";
import { UserPagePermission } from "@/types/user-permission";
import { withApiBase } from "@/lib/base-path";

export async function getUserPagePermissions(
    page: number = 1,
    limit: number = 10,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
    filters?: {
        role?: string;
        search?: string;
    }
): Promise<{ data: IUser[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.role) params.append("role", filters.role);

    const response = await fetch(withApiBase(`/api/permissions?${params.toString()}`));
    if (!response.ok) {
        throw new Error('Failed to fetch user permissions');
    }
    return response.json();
}

export async function setUserPagePermissions(
    userId: string,
    permissions: UserPagePermission[]
): Promise<UserPagePermission[]> {
    const response = await fetch(withApiBase('/api/permissions'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, permissions }),
    });
    if (!response.ok) {
        throw new Error('Failed to set user permissions');
    }
    return response.json();
}

export async function deleteUserPagePermission(userId: string, pageId: string): Promise<void> {
    const response = await fetch(withApiBase(`/api/permissions/${userId}/${pageId}`), {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete user permission');
    }
}
