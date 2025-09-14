import { getStore } from "@netlify/blobs";

export default async (request, context) => {

  const store = getStore("subcount");
  // store.set("count", 7);
  console.log(store);
  const count = await store.get("count");

  return new Response("The Sub Count is: " + count, {
    headers: { "content-type": "text/plain" },
  });
};