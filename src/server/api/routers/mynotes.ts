/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const notesRouter = createTRPCRouter({
  newNote: publicProcedure
    .input(
      z.object({
        title: z.string().min(5, { message: 'Must be 5 or more characters of length' }),
        description: z
          .string()
          .min(5, { message: 'Must be 5 or more characters of length' })
          .max(200, { message: 'Must not be greater then 200 characters' })
          .trim()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.notes.create({
          data: { ...input }
        })
      } catch (error) {
        console.log(error)
      }
    }),
  deleteNote: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.notes.delete({ where: { id: input } })
      } catch (error) {
        console.log(error)
      }
    }),
  allNotes: publicProcedure
    .query(async ({ ctx }) => {
      try {
        return (
          await ctx.prisma.notes.findMany({
            select: {
              title: true,
              description: true,
              id: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          })
        )
      } catch (error) {
        console.log(error)
      }
    }),
  detailNote: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return (
          await ctx.prisma.notes.findUnique({ where: input })
        )
      } catch (error) {
        console.log(error)
      }
    }),
  updateNote: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(5, { message: 'Must be 5 or more characters of length' }),
      description: z
        .string()
        .min(5, { message: 'Must be 5 or more characters of length' })
        .max(200, { message: 'Must not be greater then 200 characters' })
        .trim()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input
        return (
          await ctx.prisma.notes.update({
            where: { id },
            data: updateData
          })
        )
      } catch (error) {
        console.log(error)
      }
    })
});
