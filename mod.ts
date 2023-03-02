// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { type Handler } from "./deps.ts";
import { withContentType } from "./content_length.ts";

/** HTTP `content-length` header middleware.
 * Add or remove `content-length` headers in compliance with [RFC 9110, 8.6 Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#name-content-length) safely .
 *
 * @example
 * ```ts
 * import contentLength from "https://deno.land/x/http_content_length@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * declare const request: Request;
 * const handler = () => new Response("hello");
 *
 * const response = await contentLength(request, handler);
 *
 * assertEquals(response.headers.get("content-length"), "5");
 * ```
 */
export default async function contentLength(
  request: Request,
  next: Handler,
): Promise<Response> {
  const response = await next(request);

  return withContentType(request, response);
}
