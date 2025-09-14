import { getStore } from "@netlify/blobs";

export default async (request, context) => {

  if (request.method === "GET") {
    // Read the counter
    const count = await store.get("count");
    return new Response(JSON.stringify(
      { count: parseInt(count) }),
      { headers: { "content-type": "application/json" }});
  }

  if (request.method === "POST") {
    // Parse JSON body from request
    const body = await request.json();
    let count = parseInt(await store.get("count"));

    // Handle different update types
    if (body.increment) count += body.increment;
    if (body.set !== undefined) count = body.set;

    await store.set("count", count);

    return new Response(JSON.stringify({ count }), {
      headers: { "content-type": "application/json" },
    });
  }

  // Unsupported method
  return new Response("Method Not Allowed", { status: 405 });
};