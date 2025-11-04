import { getStore } from "@netlify/blobs";

export default async (request) => {
  const store = getStore("count");
  const key = "subCount";

  // Parse headers
  const headers = Object.fromEntries(request.headers);
  const modHeader = headers["x-kicklet-mod"];
  console.log("modHeader RAW:", JSON.stringify(modHeader));
  console.log("typeof modHeader:", typeof modHeader);

  // Handle Kicklet-style GET with sub count update
  if (request.method === "GET" && modHeader) {
    try {
      const current = (await store.get(key)) ?? 0;
      let newCount;

      if (modHeader.startsWith("=")) {
        const value = parseInt(modHeader.slice(1).trim(), 10);
        console.log("Set value:", value, "Type:", typeof value);
        if (isNaN(value)) throw new Error("Invalid set value");
        newCount = value;
      } else {
        const delta = parseInt(modHeader.trim(), 10);
        console.log("Parsed delta:", delta, "Type:", typeof delta);
        if (isNaN(delta)) throw new Error("Invalid increment value");
        newCount = Number(current) + Number(delta); // 💥 make sure it's numeric addition
      }

      await store.set(key, newCount);

      return new Response(JSON.stringify({ count: newCount }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Basic GET to read current count
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

  return new Response("Method Not Allowed", { status: 405 });
};
