import { getStore } from "@netlify/blobs";

const usersStore = getStore("users");
const settingsStore = getStore("settings");

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { username, password, settings } = await request.json();

  // Verify user
  const storedPassword = await usersStore.get(username);
  if (!storedPassword || storedPassword !== password) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
      headers: { "content-type": "application/json" },
      status: 401
    });
  }

  // Save new settings (all at once)
settings.forEach(async item => {
    await settingsStore.set(item.setting, item.value);
});

  return new Response(JSON.stringify({ success: true }), {
    headers: { "content-type": "application/json" }
  });
};
