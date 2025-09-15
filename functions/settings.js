import { getStore } from "@netlify/blobs";

const settingsStore = getStore("settings");

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { updates } = await request.json();

    if (!Array.isArray(updates)) {
      return new Response(JSON.stringify({ success: false, error: "Updates must be an array" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }

    // Apply updates to the blob (plain object)
    for (const { key, value } of updates) {
      if (typeof key === "string") {
        await settingsStore.set(key, value);
      }
    }

    // Return all current settings
    const allKeys = await settingsStore.list();
    const currentSettings = {};
    for (const key of allKeys) {
      currentSettings[key] = await settingsStore.get(key);
    }

    return new Response(JSON.stringify({ success: true, settings: currentSettings }), {
      headers: { "content-type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { "content-type": "application/json" },
      status: 500,
    });
  }
};