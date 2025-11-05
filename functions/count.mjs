import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // needed for Neon over HTTPS
});

export default async (request) => {
  if (request.method !== "GET" && request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const headers = Object.fromEntries(request.headers);
  const mod = headers["x-kicklet-mod"];

  try {
    const client = await pool.connect();

    // Read current count
    const result = await client.query("SELECT count FROM sub_count LIMIT 1");
    const current = result.rows[0]?.count ?? 0;

    let newCount = current;

    // Handle update via header
    if (typeof mod === "string" && mod.trim() !== "") {
      if (mod.startsWith("=")) {
        const value = parseInt(mod.slice(1).trim(), 10);
        if (isNaN(value)) throw new Error("Invalid set value");

        await client.query("UPDATE sub_count SET count = $1", [value]);
        newCount = value;
      } else {
        const delta = parseInt(mod.trim(), 10);
        if (isNaN(delta)) throw new Error("Invalid increment/decrement value");

        await client.query("UPDATE sub_count SET count = count + $1", [delta]);
        newCount = current + delta;
      }
    }

    client.release();

    return new Response(JSON.stringify({ count: newCount }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
