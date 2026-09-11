import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max);

export const leadSchema = z.object({
  type: z.enum(["beratung", "termin", "tarifcheck", "bewerbung", "kontakt"]).default("beratung"),
  name: trimmed(120).min(2, "Bitte gib deinen Namen an."),
  email: z.string().trim().toLowerCase().email("Bitte gib eine gültige E-Mail-Adresse an.").max(200),
  phone: trimmed(40).optional().or(z.literal("")),
  topic: trimmed(80).optional().or(z.literal("")),
  region: trimmed(80).optional().or(z.literal("")),
  situation: trimmed(80).optional().or(z.literal("")),
  message: trimmed(2000).optional().or(z.literal("")),
  preferredChannel: trimmed(40).optional().or(z.literal("")),
  preferredTime: trimmed(120).optional().or(z.literal("")),
  advisorSlug: trimmed(80).optional().or(z.literal("")),
  source: trimmed(120).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Bitte stimme der Datenverarbeitung zu." }),
  // Honeypot – muss leer bleiben
  website: z.string().max(0).optional().or(z.literal("")),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(6).max(200),
});

export const leadUpdateSchema = z.object({
  status: z.enum(["neu", "kontaktiert", "termin_bestaetigt", "in_beratung", "abgeschlossen", "verloren"]).optional(),
  confirmedSlot: trimmed(160).optional(),
  assignToMe: z.boolean().optional(),
  note: trimmed(2000).optional(),
});

export const chatMessageSchema = z.object({
  body: trimmed(1000).min(1),
});

export const employeeCreateSchema = z.object({
  name: trimmed(120).min(2, "Bitte gib einen Namen ein."),
  email: z.string().trim().toLowerCase().email("Bitte gib eine gültige E-Mail-Adresse an.").max(200),
  password: z.string().min(8, "Mindestens 8 Zeichen").max(200),
  role: z.enum(["admin", "berater"]).default("berater"),
  advisorId: z.coerce.number().int().positive().nullable().optional().or(z.literal(null)),
  active: z.boolean().default(true),
});

export const advisorUpdateSchema = z.object({
  id: z.coerce.number().int().positive(),
  image: trimmed(500).optional().or(z.literal("")),
  name: trimmed(120).optional(),
  title: trimmed(120).optional(),
  city: trimmed(120).optional(),
  region: trimmed(120).optional(),
  email: trimmed(200).optional().or(z.literal("")),
  phone: trimmed(80).optional().or(z.literal("")),
  whatsapp: trimmed(80).optional().or(z.literal("")),
  bio: trimmed(2000).optional(),
  quote: trimmed(500).optional().or(z.literal("")),
  active: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});
