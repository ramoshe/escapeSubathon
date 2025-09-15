import { getStore } from "@netlify/blobs";

const users = getStore("users");

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { username, password } = await request.json();
  const storedPassword = await users.get(username);

  const success = storedPassword && storedPassword === password;

  return new Response(JSON.stringify({ success }), {
    headers: { "content-type": "application/json" },
    status: success ? 200 : 401,
  });
};
