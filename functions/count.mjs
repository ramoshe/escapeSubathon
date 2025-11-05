import { getStore } from "@netlify/blobs";

export default async (request) => {
  const store = getStore("count");
  const key = "subCount";

  // Only allow GET and POST
  if (!["GET", "POST"].includes(request.method)) {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Parse custom header
    const headers = Object.fromEntries(request.headers);
    const mod = headers["x-kicklet-mod"];

    // Only run update logic if mod is present and not empty
    if (request.method === "GET" && typeof mod === "string" && mod.trim() !== "") {
      // Add jitter to reduce race condition collisions
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 100));

      const raw = await store.get(key);
      const current = Number(raw ?? 0);

      let newCount;

      if (mod.startsWith("=")) {
        const value = parseInt(mod.slice(1).trim(), 10);
        if (isNaN(value)) throw new Error("Invalid set value");
        newCount = value;
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

    // Default GET: return current count
    if (request.method === "GET") {
      const raw = await store.get(key);
      const count = Number(raw ?? 0);
      return new Response(JSON.stringify({ count }), {
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
