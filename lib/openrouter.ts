export type OpenRouterModel = {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
  isFree: boolean;
};

export async function fetchModels(apiKey: string): Promise<OpenRouterModel[]> {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch models');
  const data = await res.json();

  return (data.data as OpenRouterModel[])
    .map((m) => ({
      ...m,
      isFree:
        m.pricing?.prompt === '0' ||
        m.pricing?.prompt === '0.0' ||
        Number(m.pricing?.prompt) === 0,
    }))
    .sort((a, b) => {
      // Free first, then alphabetical
      if (a.isFree && !b.isFree) return -1;
      if (!a.isFree && b.isFree) return 1;
      return a.name.localeCompare(b.name);
    });
}

export async function callModel({
  apiKey,
  modelId,
  messages,
  onChunk,
}: {
  apiKey: string;
  modelId: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  onChunk?: (chunk: string) => void;
}): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://llm-council.vercel.app',
      'X-Title': 'LLM Council',
    },
    body: JSON.stringify({
      model: modelId,
      messages,
      stream: !!onChunk,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error: ${err}`);
  }

  if (!onChunk) {
    const data = await res.json();
    return data.choices[0]?.message?.content ?? '';
  }

  // Streaming
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    const lines = text.split('\n').filter((l) => l.startsWith('data: '));
    for (const line of lines) {
      const json = line.slice(6);
      if (json === '[DONE]') break;
      try {
        const parsed = JSON.parse(json);
        const chunk = parsed.choices?.[0]?.delta?.content ?? '';
        if (chunk) {
          full += chunk;
          onChunk(chunk);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return full;
}
