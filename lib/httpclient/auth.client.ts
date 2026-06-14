import { IUser } from "@/types/user"
import { apiHref } from "@/lib/httpclient/base"
import type { Language } from "@/types/language"

interface ILoginRequest {
    username: string
    password: string
}

interface IRegisterRequest extends ILoginRequest {
    fullName: string
}

interface IForgotPasswordRequest {
    username: string
    language: Language
}

interface IResetPasswordRequest {
    token: string
    password: string
}

interface IAuthResponse {
    user?: IUser
    success?: boolean
    status?: "sent" | "already_sent"
    error?: string
}

export async function loginUser(data: ILoginRequest): Promise<IAuthResponse> {
    const response = await fetch(apiHref("/api/auth/login"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to login")
    }

    return response.json()
}

export async function registerUser(data: IRegisterRequest): Promise<IAuthResponse> {
    const response = await fetch(apiHref("/api/auth/register"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to register")
    }

    return response.json()
}

export async function forgotPassword(data: IForgotPasswordRequest): Promise<IAuthResponse> {
    const response = await fetch(apiHref("/api/auth/forgot-password"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || error.error || "Failed to request password reset")
    }

    return response.json()
}

export async function resetPassword(data: IResetPasswordRequest): Promise<IAuthResponse> {
    const response = await fetch(apiHref("/api/auth/reset-password"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || error.error || "Failed to reset password")
    }

    return response.json()
}

export async function logoutUser(): Promise<boolean> {
    await fetch(apiHref("/api/auth/logout"), { method: "POST" });
    return true;
}

export async function getUsers(
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

    const response = await fetch(apiHref(`/api/users?${params.toString()}`));
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
}

export async function getUserById(id: string): Promise<IUser> {
    const response = await fetch(apiHref(`/api/users/${id}`));
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    return response.json();
}

export async function updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
    const response = await fetch(apiHref(`/api/users/${id}`), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update user")
    }

    return response.json()
}
