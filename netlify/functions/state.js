import { getStore } from '@netlify/blobs';

const STORE_NAME = 'onboarding-portal';
const KEY = 'state';

export default async (req) => {
  const store = getStore(STORE_NAME);

  if (req.method === 'GET') {
    const data = await store.get(KEY, { type: 'json' });
    return new Response(JSON.stringify(data || null), {
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
    }
    body.updatedAt = Date.now();
    await store.setJSON(KEY, body);
    return new Response(JSON.stringify({ ok: true, updatedAt: body.updatedAt }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/.netlify/functions/state' };
