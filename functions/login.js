import { getStore } from "@netlify/blobs";

const store = getStore("users");

function generateToken() {
  return Math.random().toString(36).substring(2, 12);
}

export default async (request) => {
  const existing = await store.get("users") || "{}";
  const users = JSON.parse(existing);

  if (request.method === "POST") {
    const { username, password } = await request.json();

    if (!users[username] || users[username].password !== password) {
      return new Response(JSON.stringify({ success: false }), { status: 401, headers: { "content-type": "application/json" } });
    }

    const token = generateToken();
    const expiry = Date.now() + 24*60*60*1000; // 24h

    users[username].token = token;
    users[username].expiry = expiry;
    await store.set("users", JSON.stringify(users));

    return new Response(JSON.stringify({ success: true, token }), { headers: { "content-type": "application/json" } });
  }

  if (request.method === "GET") {
    const token = new URL(request.url).searchParams.get("token");
    for (const [username, data] of Object.entries(users)) {
      if (data.token === token && data.expiry > Date.now()) {
        return new Response(JSON.stringify({ valid: true, username }), { headers: { "content-type": "application/json" } });
      }
    }
    return new Response(JSON.stringify({ valid: false }), { headers: { "content-type": "application/json" }, status: 401 });
  }

  return new Response("Method Not Allowed", { status: 405 });
};
