import {
  isInformationalStatus,
  isString,
  isSuccessfulStatus,
  Method,
  Status,
} from "./deps.ts";

enum Field {
  ContentLength = "content-length",
}

export function withContentType(
  request: Request,
  response: Response,
): Response | Promise<Response> {
  if (
    isInformationalStatus(response.status) ||
    response.status === Status.NoContent ||
    request.method === Method.Connect && isSuccessfulStatus(response.status)
  ) {
    response.headers.delete(Field.ContentLength);

    return response;
  }

  const contentLengthValue = response.headers.get(Field.ContentLength);

  if (response.bodyUsed || isString(contentLengthValue)) return response;

  return response
    .clone()
    .arrayBuffer()
    .then(({ byteLength }) => byteLength)
    .then(String)
    .then((contentLength) => {
      response.headers.set(Field.ContentLength, contentLength);

      return response;
    });
}
