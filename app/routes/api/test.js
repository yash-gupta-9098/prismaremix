export async function loader({ request }) {
    // This function handles GET requests
    const data = { message: "Hello from Remix API" };
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }