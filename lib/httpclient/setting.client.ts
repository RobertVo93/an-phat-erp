import { apiHref, createApiUrl, apiFetch } from "@/lib/httpclient/base";
import type { ISetting, ISettingFilters } from "@/types/setting.interface";

export async function getSettingsClient(filters: ISettingFilters = {}) {
    const url = createApiUrl("/api/settings");
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
    });

    const res = await apiFetch(url.toString(), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
}

export async function updateSettingClient(id: string, data: Partial<ISetting>) {
    const res = await apiFetch(apiHref(`/api/settings/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update setting");
    return res.json();
}
