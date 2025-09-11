// edge-functions/hello.js
export default async (request, context) => {
  return new Response("Hello, world! from Edge Functions", {
    headers: { "content-type": "text/plain" },
  });
};
