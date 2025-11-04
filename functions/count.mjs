import { getStore } from "@netlify/blobs";

export default async (request) => {
  const store = getStore("count");
  const key = "subCount";

  // Extract headers
  const headers = Object.fromEntries(request.headers);
  const command = headers["x-kicklet-command"];

  // GET request with a Kicklet command
  if (request.method === "GET" && command === "increment") {
    try {
      const current = (await store.get(key)) ?? 0;
      const newCount = current + 1;
      await store.set(key, newCount);

      return new Response(JSON.stringify({ count: newCount }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to increment count." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Normal GET (just read the count)
  if (request.method === "GET") {
    try {
      const count = (await store.get(key)) ?? 0;

      return new Response(JSON.stringify({ count }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to read sub count." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // POST update logic remains (for frontend or admin tools)
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const current = (await store.get(key)) ?? 0;

      let newCount;

      if (typeof body.increment === "number") {
        newCount = current + body.increment;
      } else if (typeof body.set === "number") {
        newCount = body.set;
      } else {
        return new Response(
          JSON.stringify({ error: "Missing valid 'increment' or 'set' field." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      await store.set(key, newCount);

      return new Response(JSON.stringify({ count: newCount }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to update count." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
};
