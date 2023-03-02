# http-content-length

HTTP `content-length` header middleware for standard `Request` and `Response`.

## What

Middleware for HTTP `content-length` headers.

[RFC 9110, 8.6 Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#name-content-length)
compliant, safely add or remove `content-length` header.

## Middleware

For a definition of Universal HTTP middleware, see the
[http-middleware](https://github.com/httpland/http-middleware) project.

## Usage

Middleware is exported by default.

```ts
import contentLength from "https://deno.land/x/http_content_length@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

declare const request: Request;
const handler = () => new Response("hello");

const response = await contentLength(request, handler);

assertEquals(response.headers.get("content-length"), "5");
```

## Deep dive

Based on
[RFC 9110, 8.6 Content-Length](https://www.rfc-editor.org/rfc/rfc9110.html#name-content-length),
it is guaranteed that there is no `content-length` header in the `Response`.

- If the `Response` status code is informational(1XX).
- If the `Response` status code is no content(204).
- If HTTP request method is `CONNECT` and `Response` status code is
  successful(2XX).

Otherwise, it is guaranteed that the `content-length` header is in the
`Response`.

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
