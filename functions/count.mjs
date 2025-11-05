import pkg from "pg";
const { Pool } = pkg;

// Use Netlify's environment variable for DB connection
const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async (request) => {
  if (!["GET", "POST"].includes(request.method)) {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const headers = Object.fromEntries(request.headers);
  const mod = headers["x-kicklet-mod"];

  try {
    const client = await pool.connect();

    // If mod header is present and has a value
    if (request.method === "GET" && typeof mod === "string" && mod.trim() !== "") {
      const result = await client.query("SELECT count FROM sub_count LIMIT 1");
      const current = result.rows[0]?.count ?? 0;

      let newCount;

      if (mod.trim().toLowerCase() === "q") {
        newCount = current;
      } else if (mod.startsWith("=")) {
        const value = parseInt(mod.slice(1).trim(), 10);
        if (isNaN(value)) throw new Error("Invalid set value");

        const update = await client.query(
          "UPDATE sub_count SET count = $1 RETURNING count",
          [value]
        );

        newCount = update.rows[0]?.count ?? value;
      } else {
        const delta = parseInt(mod.trim(), 10);
        if (isNaN(delta)) throw new Error("Invalid increment/decrement value");

        const update = await client.query(
          "UPDATE sub_count SET count = count + $1 RETURNING count",
          [delta]
        );

        newCount = update.rows[0]?.count;
      }

      client.release();

      return new Response(JSON.stringify({ count: newCount }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Fallback: return current count
    if (request.method === "GET") {
      const result = await client.query("SELECT count FROM sub_count LIMIT 1");
      const current = result.rows[0]?.count ?? 0;

      client.release();

      return new Response(JSON.stringify({ count: current }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Unsupported method", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
