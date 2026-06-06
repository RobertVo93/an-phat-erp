import { z } from "zod";

const SettingValueSchema = z.union([
    z.record(z.unknown()),
    z.array(z.unknown()),
    z.string().min(1),
    z.number(),
    z.boolean(),
]);

export const UpdateSettingSchema = z.object({
    value: SettingValueSchema,
    description: z.string().optional(),
}).partial();
