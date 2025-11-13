export async function GET() {
  return new Response(JSON.stringify({
    EMAIL_USER: process.env.EMAIL_USER || 'VACIO',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'DETECTADA' : 'VACIA'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
