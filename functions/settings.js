import { getStore } from "@netlify/blobs";

const settingsStore = getStore("settings");

export default async (request) => {
  // --- GET current settings ---
  if (request.method === "GET") {
    try {
      const keys = await settingsStore.list();
      const currentSettings = {};
      for (const entry of keys) {             // <-- entry is an object
        currentSettings[entry.key] = await settingsStore.get(entry.key);
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
  }

  // --- POST: update settings ---
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

    for (const { key, value } of updates) {
      if (typeof key === "string") {
        await settingsStore.set(key, value);
      }
    }

    // Return all current settings
    const allKeys = await settingsStore.list();
    const currentSettings = {};
    for (const entry of allKeys) {           // <-- same fix here
      currentSettings[entry.key] = await settingsStore.get(entry.key);
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
