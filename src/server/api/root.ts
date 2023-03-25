import { createTRPCRouter } from "~/server/api/trpc";
import { subscribeRouter } from "~/server/api/routers/subscribe";
import { notesRouter } from "./routers/mynotes";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  subscribe: subscribeRouter,
  notes: notesRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
