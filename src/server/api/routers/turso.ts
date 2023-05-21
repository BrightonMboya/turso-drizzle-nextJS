import { createClient } from '@libsql/client/web';
// import { eq } from 'drizzle-orm/expressions';
import { drizzle } from 'drizzle-orm/libsql';
import { insertMusicRecordSchema, selectMusicRecordSchema, users, musicRecords } from "~/db/schema";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from '~/env.mjs';

const client = createClient({
    url: env.DATABASE_URL as string,
    authToken: env.DATABASE_AUTH_TOKEN as string,
});
export const db = drizzle(client);

// const listUsersResponse = selectUserSchema.array();

export const tursoRouter = createTRPCRouter({
    allUsers: publicProcedure
        .query(async () => {
            const allUsers = await db.select().from(users).all();
            return allUsers;
            // return listUsersResponse.parse(allUsers);
        }),

    allRecords: publicProcedure
        .query(async () => {
            const allRecords = await db.select().from(musicRecords).all();
            return allRecords;
        }
        ),

    createRecord: publicProcedure.input(
        z.object({
            title: z.string(),
            artist: z.string(),
            year: z.string(),
        })
    ).mutation(async ({ input }) => {
        const { title, artist, year } = input;
        const insertResult = await db.insert(musicRecords).values({
            title,
            artist,
            year,
        }).returning().get();
        return insertResult;
    })
})