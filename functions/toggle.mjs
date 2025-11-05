import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async (request) => {
  const headers = Object.fromEntries(request.headers);
  const toggleKey = headers["x‑kicklet‑mod"];
  console.log("Toggle request for:", toggleKey);

  try {
    const client = await pool.connect();

    if (request.method === "GET") {
      const result = await client.query("SELECT is_irl, is_sleep, is_joystick FROM stream_toggles LIMIT 1");
      client.release();
      return new Response(JSON.stringify(result.rows[0] ?? {}), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "POST") {
      if (!["irl", "sleep", "joystick"].includes(toggleKey)) {
        client.release();
        return new Response(JSON.stringify({ error: "Invalid toggle key" }), { status: 400, headers: { "Content-Type": "application/json" }});
      }

      const field = `is_${toggleKey}`;
      const updateResult = await client.query(
        `UPDATE stream_toggles SET ${field} = NOT ${field} RETURNING ${field}`
      );

      client.release();

      console.log("Toggle update result:", updateResult.rows);

      if (updateResult.rows.length === 0) {
        return new Response(JSON.stringify({ error: "No row updated" }), { status: 500, headers: { "Content-Type": "application/json" }});
      }

      const newValue = updateResult.rows[0][field];
      return new Response(JSON.stringify({ [field]: newValue }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    client.release();
    return new Response("Method Not Allowed", { status: 405 });
  } catch (err) {
    console.error("Toggle function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
