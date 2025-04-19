import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    // 1) Забираем JSON‑тело (будет { paramsToSign: {...}, folder: "avatars/3" })
    const body = await request.json();

    // 2) Читаем Authorization‑заголовок (Bearer <token>)
    const auth = request.headers.get('authorization') || '';

    // 3) Проксируем на Django‑бэкенд
    const resp = await axios.post(
      'http://127.0.0.1:8000/api/v1/users/avatar-signature/',
      body,
      {
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
      }
    );

    // 4) Возвращаем результат назад клиенту
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (err) {
    console.error('AvatarSignature proxy error:', err);
    return NextResponse.json(
      { error: 'Signature proxy failed' },
      { status: err.response?.status || 500 }
    );
  }
}