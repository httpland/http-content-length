import {
  assert,
  describe,
  equalsResponse,
  it,
  Method,
  Representation,
  Status,
} from "./_dev_deps.ts";
import { withContentLength } from "./content_length.ts";

describe("withContentLength", () => {
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
          headers: { [Representation.ContentLength]: "0" },
        }),
        new Response(null, { status: Status.SwitchingProtocols }),
      ],
      [
        new Request("test:"),
        new Response(null, {
          status: Status.NoContent,
          headers: { [Representation.ContentLength]: "0" },
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
          headers: { [Representation.ContentLength]: "0" },
        }),
        new Response(null),
      ],
    ];

    await Promise.all(table.map(async ([request, response, expected]) => {
      const result = await withContentLength(
        request,
        response,
      );

      assert(equalsResponse(result, expected));
    }));
  });

  it("should return same response", async () => {
    const used = new Response("");
    await used.text();

    const table: [Request, Response, Response][] = [
      [
        new Request("test:"),
        new Response(null, {
          headers: { [Representation.ContentLength]: "0" },
        }),
        new Response(null, {
          headers: { [Representation.ContentLength]: "0" },
        }),
      ],
      [
        new Request("test:"),
        new Response(null, { headers: { [Representation.ContentLength]: "" } }),
        new Response(null, { headers: { [Representation.ContentLength]: "" } }),
      ],
      [
        new Request("test:"),
        used,
        used,
      ],
    ];

    await Promise.all(table.map(async ([request, response, expected]) => {
      const result = await withContentLength(
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
        new Response(null, {
          headers: { [Representation.ContentLength]: "0" },
        }),
      ],
      [
        new Request("test:"),
        new Response("abc"),
        new Response("abc", {
          headers: { [Representation.ContentLength]: "3" },
        }),
      ],
      [
        new Request("test:"),
        new Response("あいうえお"),
        new Response("あいうえお", {
          headers: { [Representation.ContentLength]: "15" },
        }),
      ],
    ];

    await Promise.all(table.map(async ([request, response, expected]) => {
      const result = await withContentLength(
        request,
        response,
      );

      assert(await equalsResponse(result, expected, true));
    }));
  });
});
