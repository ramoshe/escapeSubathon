import { getStore } from "@netlify/blobs";

const store = getStore("users");

export default async (request) => {
  const users = JSON.parse(await store.get("users") || "{}");

  if (request.method === "POST") {
    const { username, password } = await request.json();

    if (!users[username] || users[username] !== password) {
      return new Response(JSON.stringify({ success: false }), {
        headers: { "content-type": "application/json" },
        status: 401
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "content-type": "application/json" }
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
};
