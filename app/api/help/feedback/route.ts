export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const payload = {
      path: body?.path ?? '',
      vote: body?.vote ?? null,
      text: body?.text ?? '',
      at: new Date().toISOString(),
      ua: req.headers.get('user-agent') || '',
    };
    // In this environment, we just log. Replace with persistence as needed.
    console.log('[help/feedback]', payload);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
