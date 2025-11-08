export async function POST(req) {
  const body = await req.json();
  if (!body.form.name || !body.form.email || !body.form.address)
    return new Response(JSON.stringify({ error: "Invalid data" }), { status: 400 });

  const id = "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  return new Response(JSON.stringify({ id }), { status: 200 });
}
