import { IUser } from "@/types/user"

interface ILoginRequest {
    email: string
    password: string
}

interface IRegisterRequest extends ILoginRequest {
    username: string
}

interface IAuthResponse {
    user?: IUser
    success?: boolean
    error?: string
}

export async function loginUser(data: ILoginRequest): Promise<IAuthResponse> {
    const response = await fetch("/api/auth/login", {
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
    const response = await fetch("/api/auth/register", {
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

export async function logoutUser(): Promise<boolean> {
    await fetch("/api/auth/logout", { method: "POST" });
    return true;
}
