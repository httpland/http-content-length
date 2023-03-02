import { type Handler } from "./deps.ts";
import { withContentType } from "./content_length.ts";

/** HTTP `content-length` header middleware.
 * Add or remove `content-length` headers in compliance with [RFC 9110, 8.6 Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#name-content-length) safely .
 *
 * @param request
 * @param next
 */
export default async function contentLength(
  request: Request,
  next: Handler,
): Promise<Response> {
  const response = await next(request);

  return withContentType(request, response);
}
