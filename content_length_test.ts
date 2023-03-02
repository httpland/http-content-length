import {
  assert,
  describe,
  equalsResponse,
  it,
  Method,
  Status,
} from "./_dev_deps.ts";
import { withContentType } from "./content_length.ts";

describe("withContentType", () => {
  it("should delete content-length header", async () => {
    const table: [Request, Response, Response][] = [
      [
        new Request("test:"),
        new Response(null, { status: Status.SwitchingProtocols }),
        new Response(null, { status: Status.SwitchingProtocols }),
      ],
      [
        new Request("test:"),
        new Response(null, {
          status: Status.SwitchingProtocols,
          headers: { "content-length": "0" },
        }),
        new Response(null, { status: Status.SwitchingProtocols }),
      ],
      [
        new Request("test:"),
        new Response(null, {
          status: Status.NoContent,
          headers: { "content-length": "0" },
        }),
        new Response(null, { status: Status.NoContent }),
      ],
      [
        Object.defineProperty(
          new Request("test:"),
          "method",
          { value: Method.Connect },
        ),
        new Response(null, {
          status: Status.OK,
          headers: { "content-length": "0" },
        }),
        new Response(null),
      ],
    ];

    await Promise.all(table.map(async ([request, response, expected]) => {
      const result = await withContentType(
        request,
        response,
      );

      assert(equalsResponse(result, expected));
    }));
  });

  it("should return same response", async () => {
    const table: [Request, Response, Response][] = [
      [
        new Request("test:"),
        new Response(null, { headers: { "content-length": "0" } }),
        new Response(null, { headers: { "content-length": "0" } }),
      ],
      [
        new Request("test:"),
        new Response(null, { headers: { "content-length": "" } }),
        new Response(null, { headers: { "content-length": "" } }),
      ],
      [
        new Request("test:"),
        Object.defineProperty(new Response(null), "bodyUsed", { value: true }),
        new Response(null),
      ],
    ];

    await Promise.all(table.map(async ([request, response, expected]) => {
      const result = await withContentType(
        request,
        response,
      );

      assert(equalsResponse(result, expected));
    }));
  });

  it("should add content-length field", async () => {
    const table: [Request, Response, Response][] = [
      [
        new Request("test:"),
        new Response(null),
        new Response(null, { headers: { "content-length": "0" } }),
      ],
      [
        new Request("test:"),
        new Response("abc"),
        new Response("abc", { headers: { "content-length": "3" } }),
      ],
      [
        new Request("test:"),
        new Response("あいうえお"),
        new Response("あいうえお", { headers: { "content-length": "15" } }),
      ],
    ];

    await Promise.all(table.map(async ([request, response, expected]) => {
      const result = await withContentType(
        request,
        response,
      );

      assert(await equalsResponse(result, expected, true));
    }));
  });
});
