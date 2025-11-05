import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async (request) => {
  const headers = Object.fromEntries(request.headers);
  const toggleKey = headers["x-kicklet-mod"]; // ensure real hyphens

  try {
    const client = await pool.connect();

    // Respond to a basic GET to return current states
    if (request.method === "GET" && !toggleKey) {
      const result = await client.query("SELECT is_irl, is_sleep, is_joystick FROM stream_toggles LIMIT 1");
      client.release();
      return new Response(JSON.stringify(result.rows[0] ?? {}), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // Handle GET with a toggle instruction
    if (request.method === "GET" && ["irl", "sleep", "joystick"].includes(toggleKey)) {
      const field = `is_${toggleKey}`;
      const updateResult = await client.query(
        `UPDATE stream_toggles SET ${field} = NOT ${field} RETURNING is_irl, is_sleep, is_joystick`
      );

      client.release();

      if (updateResult.rows.length === 0) {
        return new Response(JSON.stringify({ error: "Toggle update failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify(updateResult.rows[0]), {
        headers: { "Content-Type": "application/json" }
      });
    }

    client.release();
    return new Response("Invalid toggle request", { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
