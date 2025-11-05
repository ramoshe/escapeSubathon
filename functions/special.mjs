import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NETLIFY_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async (request) => {
  const headers = Object.fromEntries(request.headers);
  const raw = headers["x-kicklet-special"];

  try {
    const client = await pool.connect();

    let goal = 0;
    let label = "";
    let minutes = null;

    if (typeof raw === "string" && raw.includes("|")) {
      const parts = raw.split("|");
      goal = parseInt(parts[0], 10) || 0;
      label = parts[1]?.trim() || "";
      minutes = parts[2] ? parseInt(parts[2], 10) : null;

      if (!label || goal < 1) {
        throw new Error("Missing or invalid goal or label.");
      }

      const start = new Date().toISOString();
      await client.query(
        "UPDATE special_offer SET label = $1, goal = $2, timer_minutes = $3, timer_start = $4",
        [label, goal, minutes, start]
      );
    }

    const result = await client.query("SELECT * FROM special_offer LIMIT 1");
    client.release();

    const current = result.rows[0] ?? {};
    const now = new Date();
    const start = current.timer_start ? new Date(current.timer_start) : null;

    let timeRemaining = null;
    if (start && current.timer_minutes) {
      const end = new Date(start.getTime() + current.timer_minutes * 60000);
      timeRemaining = Math.max(0, Math.floor((end - now) / 1000));
    }

    return new Response(
      JSON.stringify({
        label: current.label ?? "",
        goal: current.goal ?? 0,
        timer_minutes: current.timer_minutes ?? null,
        time_remaining: timeRemaining
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
