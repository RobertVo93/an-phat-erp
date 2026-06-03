import { apiHref, createApiUrl } from "@/lib/httpclient/base";
import type { Setting, SettingFilters } from "@/types/setting.interface";

export async function getSettingsClient(filters: SettingFilters = {}) {
    const url = createApiUrl("/api/settings");
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") url.searchParams.append(key, String(value));
    });

    const res = await fetch(url.toString(), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
}

export async function updateSettingClient(id: string, data: Partial<Setting>) {
    const res = await fetch(apiHref(`/api/settings/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update setting");
    return res.json();
}
