import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async (request) => {
  try {
    const client = await pool.connect();

    if (request.method === "GET") {
      const result = await client.query("SELECT is_irl, is_sleep, is_joystick FROM stream_toggles LIMIT 1");
      const toggles = result.rows[0] ?? {
        is_irl: false,
        is_sleep: false,
        is_joystick: false
      };

      client.release();
      return new Response(JSON.stringify(toggles), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "POST") {
      const headers = Object.fromEntries(request.headers);
      const toggleKey = headers["x-kicklet-toggle"];

      if (!["irl", "sleep", "joystick"].includes(toggleKey)) {
        return new Response(JSON.stringify({ error: "Invalid toggle name" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const field = `is_${toggleKey}`;

      // Flip the boolean value directly in SQL
      const update = await client.query(
        `UPDATE stream_toggles SET ${field} = NOT ${field} RETURNING ${field}`
      );

      const newValue = update.rows[0]?.[field];

      client.release();
      return new Response(JSON.stringify({ [field]: newValue }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Method Not Allowed", { status: 405 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
