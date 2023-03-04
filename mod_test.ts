import {
  assertEquals,
  assertExists,
  describe,
  it,
  Representation,
} from "./_dev_deps.ts";
import contentLength from "./mod.ts";

describe("default export", () => {
  it("should exists", () => {
    assertExists(contentLength);
  });

  it("should contain content-length header", async () => {
    const handler = () => new Response("hello");

    const response = await contentLength(new Request("test:"), handler);

    assertEquals(response.headers.get(Representation.ContentLength), "5");
  });
});
