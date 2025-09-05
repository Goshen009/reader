export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
    }
  }

  const tenantId = event.headers["x-tenant-id"];
  if (!tenantId) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error : "No tenant_id found. Iono how you did it, but you did it." })
    }
  }

  const cookieName = `cookie-${tenantId}`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
    },
    body: JSON.stringify({ message: "Logged out successfully" })
  };
}