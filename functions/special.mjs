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
      const result = await client.query("SELECT label, goal, timer_minutes, timer_start FROM reward_offer LIMIT 1");
      const row = result.rows[0];

      let time_remaining = null;

      if (row?.timer_minutes && row?.timer_start) {
        const startTime = new Date(row.timer_start).getTime();
        const endTime = startTime + row.timer_minutes * 60 * 1000;
        const now = Date.now();
        time_remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      }

      client.release();
      return new Response(JSON.stringify({
        label: row?.label ?? "",
        goal: row?.goal ?? 0,
        timer_minutes: row?.timer_minutes,
        timer_start: row?.timer_start,
        time_remaining
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "POST") {
      const headers = Object.fromEntries(request.headers);

      const goal = parseInt(headers["x-kicklet-goal"], 10);
      const label = headers["x-kicklet-label"] ?? "";
      const minutes = headers["x-kicklet-timer"] ? parseInt(headers["x-kicklet-timer"], 10) : null;
      const now = new Date().toISOString();

      if (isNaN(goal) || !label) {
        return new Response(JSON.stringify({ error: "Invalid reward parameters" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      const update = await client.query(`
        UPDATE reward_offer
        SET label = $1,
            goal = $2,
            timer_minutes = $3,
            timer_start = $4
        RETURNING *
      `, [label, goal, minutes, now]);

      client.release();
      return new Response(JSON.stringify(update.rows[0]), {
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
