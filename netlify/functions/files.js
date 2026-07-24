import { getStore } from '@netlify/blobs';

const STORE_NAME = 'onboarding-portal-files';

function uid() {
  return 'f-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

export default async (req) => {
  const store = getStore(STORE_NAME);
  const url = new URL(req.url);

  if (req.method === 'POST') {
    const name = req.headers.get('x-file-name') || 'file';
    const type = req.headers.get('x-file-type') || 'application/octet-stream';
    const buf = await req.arrayBuffer();
    const id = uid();
    await store.set(id, buf, {
      metadata: { name: decodeURIComponent(name), type, size: buf.byteLength },
    });
    return new Response(JSON.stringify({ id, name: decodeURIComponent(name), type, size: buf.byteLength }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  if (req.method === 'GET') {
    const id = url.searchParams.get('id');
    if (!id) return new Response('Missing id', { status: 400 });
    const result = await store.getWithMetadata(id, { type: 'arrayBuffer' });
    if (!result) return new Response('Not found', { status: 404 });
    const { data, metadata } = result;
    return new Response(data, {
      headers: {
        'content-type': metadata?.type || 'application/octet-stream',
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  }

  if (req.method === 'DELETE') {
    const id = url.searchParams.get('id');
    if (!id) return new Response('Missing id', { status: 400 });
    await store.delete(id);
    return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/.netlify/functions/files' };
