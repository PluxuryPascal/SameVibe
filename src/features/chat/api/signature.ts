import api from 'src/shared/lib/axios';

export interface SignatureParams {
  signature: string;
  timestamp: number;
  folder: string;
}

export async function fetchAttachmentSignature(chatId: number): Promise<SignatureParams> {
  const res = await api.get<SignatureParams>(`/chat/attachment-signature/?chat_id=${chatId}`);
  return res.data;
}