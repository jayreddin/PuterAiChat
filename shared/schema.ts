import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(["user", "assistant"]),
  timestamp: z.number(),
  model: z.string()
});

export const conversationSchema = z.object({
  id: z.string(),
  messages: z.array(messageSchema),
  model: z.string(),
  title: z.string().optional(),
  createdAt: z.number()
});

export type Message = z.infer<typeof messageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;
