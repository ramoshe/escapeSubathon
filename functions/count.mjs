import { getStore } from "@netlify/blobs";

export default async (request) => {
  const store = getStore("count");
  const key = "subCount";

  // Only support GET and POST
  if (!["GET", "POST"].includes(request.method)) {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const rawCount = await store.get(key);
    const current = Number(rawCount ?? 0);

    // Check for Kicklet-style header
    const headers = Object.fromEntries(request.headers);
    const mod = headers["x-kicklet-mod"];

    // If there's a mod header, update the count accordingly
    if (request.method === "GET" && mod) {
      let newCount;

      if (mod.startsWith("=")) {
        const setValue = parseInt(mod.slice(1).trim(), 10);
        if (isNaN(setValue)) throw new Error("Invalid set value");
        newCount = setValue;
      } else {
        const delta = parseInt(mod.trim(), 10);
        if (isNaN(delta)) throw new Error("Invalid increment/decrement value");
        newCount = current + delta;
      }

      await store.set(key, newCount);

      return new Response(JSON.stringify({ count: newCount }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // No header? Just return current count
    return new Response(JSON.stringify({ count: current }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
