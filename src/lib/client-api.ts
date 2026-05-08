export class ClientApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientApiError";
  }
}

function isErrorPayload(payload: unknown): payload is { error: string } {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as { error: unknown }).error === "string"
  );
}

async function readJsonPayload(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function requestJson<T>(input: RequestInfo | URL, init: RequestInit, fallback: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch {
    throw new ClientApiError(fallback);
  }

  const payload = await readJsonPayload(response);

  if (!response.ok) {
    throw new ClientApiError(isErrorPayload(payload) ? payload.error : fallback);
  }

  return payload as T;
}

export function getClientErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ClientApiError) {
    return error.message;
  }

  return fallback;
}
