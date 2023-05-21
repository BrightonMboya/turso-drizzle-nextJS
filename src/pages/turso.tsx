import { api } from "~/utils/api";
import React from "react";
import { inferProcedureInput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

const Turso = () => {
  const users = api.turso.allUsers.useQuery();
  const [title, setTitle] = React.useState<string>("");
  const [artist, setArtist] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");
  const records = api.turso.allRecords.useQuery();
  const recordRouter = api.turso.createRecord.useMutation();
  console.log(records.data);
  return (
    <>
      <h1>Users</h1>
      <pre>
        <code>{JSON.stringify(users.data, null, 2)}</code>
      </pre>
      <ul>
        {users.data?.map((user) => (
          <ul key={user.id}>
            <li>{user.name}</li>
            <li>{user.email}</li>
          </ul>
        ))}
      </ul>

      <div>
        <form
          className="flex flex-col items-center justify-center gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            type Input = inferProcedureInput<
              AppRouter["turso"]["createRecord"]
            >;
            const record: Input = {
              title,
              artist,
              year,
            };
            try {
              recordRouter.mutateAsync(record);
              setTitle("");
              setArtist("");
              setYear("");
            } catch (e) {
              console.log(e);
            }
          }}
        >
          <input
            type="text"
            placeholder="Song Title"
            className="h-[40px] w-[300px] rounded-md border-[1px] border-slate-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Artist"
            className="h-[40px] w-[300px] rounded-md border-[1px] border-slate-300"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
          <input
            type="string"
            placeholder="Year Released"
            className="h-[40px] w-[300px] rounded-md border-[1px] border-slate-300"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <button
            type="submit"
            className="h-[40px] w-[300px] rounded-md bg-slate-500 text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Turso;
