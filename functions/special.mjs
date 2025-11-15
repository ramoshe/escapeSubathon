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

    let subs = 0;
    let reward = "";

    // Explicit deactivate: header "x" (case-insensitive, spaces ok)
    if (typeof raw === "string" && raw.trim().toLowerCase() === "x") {
      await client.query("UPDATE special_offer SET active = FALSE");
    }

    if (typeof raw === "string" && raw.includes("|")) {
      const parts = raw.split("|");
      subs = parseInt(parts[0], 10) || 0;
      reward = stripOuterQuotes(parts[1]?.trim() || "");
      // if (!reward || subs < 1) {
      //   throw new Error("Missing or invalid subs or reward.");
      // }
      await client.query(
        "UPDATE special_offer SET reward = $1, subs = $2, active = TRUE",
        [reward, subs]
      );
    }

    const result = await client.query("SELECT reward, subs, active FROM special_offer LIMIT 1");
    client.release();

    const current = result.rows[0] ?? {};

    return new Response(JSON.stringify({
      active: current.active || false,
      reward: stripOuterQuotes(current.reward ?? ""),
      subs: current.subs ?? 0,
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

function stripOuterQuotes(str) {
  if (!str) return "";
  const pairs = { '"':'"', "'":"'", '“':'”', '‘':'’' };
  const first = str[0], last = str[str.length - 1];
  if (pairs[first] && last === pairs[first]) return str.slice(1, -1).trim();
  return str.trim();
}
