import { z } from "zod";

export const TriggerOptsSchema = z.object({
	method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "ANY"]),
	path: z.string().optional(),
	accept: z.string().default("application/json"),
	headers: z.record(z.string(), z.any()).optional(),
});

export type TriggerOpts = z.infer<typeof TriggerOptsSchema>;

export const TriggersSchema = z.enum(["http", "cron", "manual"]);
export type TriggersEnum = z.infer<typeof TriggersSchema>;
