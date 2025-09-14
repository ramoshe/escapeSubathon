import { getStore } from "@netlify/blobs";

const store = getStore("users");

export default async (request) => {
  const usersRaw = await store.get("users") || "{}";  // raw string
  console.log("Raw Blob:", usersRaw);

  if (request.method === "POST") {
    const { username, password } = await request.json();
    console.log("Login attempt:", username, password);

    // Instead of JSON.parse, just check the string
    if (!usersRaw.includes(`"${username}":"${password}"`)) {
      console.log("Login failed for", username);
      return new Response(JSON.stringify({ success: false }), {
        headers: { "content-type": "application/json" },
        status: 401
      });
    }

    console.log("Login successful for", username);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "content-type": "application/json" }
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
};
