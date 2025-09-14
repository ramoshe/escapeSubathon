import { getStore } from "@netlify/blobs";

const store = getStore("users");

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { username, password } = await request.json();

  // Get the stored password for this username directly
  const storedPassword = await store.get(username);

  if (!storedPassword || storedPassword !== password) {
    return new Response(JSON.stringify({ success: false }), {
      headers: { "content-type": "application/json" },
      status: 401
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "content-type": "application/json" }
  });
};
