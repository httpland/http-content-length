// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  isInformationalStatus,
  isString,
  isSuccessfulStatus,
  Method,
  RepresentationHeader,
  Status,
} from "./deps.ts";

export function withContentLength(
  request: Request,
  response: Response,
): Response | Promise<Response> {
  if (
    isInformationalStatus(response.status) ||
    response.status === Status.NoContent ||
    request.method === Method.Connect && isSuccessfulStatus(response.status)
  ) {
    response.headers.delete(RepresentationHeader.ContentLength);

    return response;
  }

  const contentLength = response.headers.get(
    RepresentationHeader.ContentLength,
  );

  if (response.bodyUsed || isString(contentLength)) return response;

  return response
    .clone()
    .arrayBuffer()
    .then(({ byteLength }) => byteLength)
    .then(String)
    .then((contentLength) => {
      response.headers.set(RepresentationHeader.ContentLength, contentLength);

      return response;
    });
}
