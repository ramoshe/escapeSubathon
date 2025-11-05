import pkg from "pg";
const { Pool } = pkg;

// Use Netlify's built-in DB env variable
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

    // SET or INCREMENT logic
    if (request.method === "GET" && typeof mod === "string" && mod.trim() !== "") {
      let newCount;

      if (mod.startsWith("=")) {
        const value = parseInt(mod.slice(1).trim(), 10);
        if (isNaN(value)) throw new Error("Invalid set value");

        const result = await client.query(
          "UPDATE sub_count SET count = $1 RETURNING count",
          [value]
        );

        newCount = result.rows[0]?.count ?? value;
      } else {
        const delta = parseInt(mod.trim(), 10);
        if (isNaN(delta)) throw new Error("Invalid increment/decrement value");

        const result = await client.query(
          "UPDATE sub_count SET count = count + $1 RETURNING count",
          [delta]
        );

        newCount = result.rows[0]?.count;
      }

      client.release();

      return new Response(JSON.stringify({ count: newCount }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // No mod header: just return the current count
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
