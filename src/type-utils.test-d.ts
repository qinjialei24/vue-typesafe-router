import { describe, expectTypeOf, test } from "vitest";
import { PathParamsToObject, PushParams } from "./type-utils";

describe("Type Utils", () => {
  test("PathParamsToObject should correctly extract path parameters", () => {
    expectTypeOf<PathParamsToObject<"/user/:id">>().toEqualTypeOf<{
      id: string;
    }>();

    expectTypeOf<
      PathParamsToObject<"/user/:id/posts/:postId">
    >().toEqualTypeOf<{ id: string; postId: string }>();
  });

  test("PushParams should correctly handle different scenarios", () => {
    expectTypeOf<PushParams<undefined, "/user/:id">>().toEqualTypeOf<{
      params: { id: string };
    }>();

    expectTypeOf<PushParams<{ page: number }, "/user/:id">>().toEqualTypeOf<{
      params: { id: string };
      query: { page: number };
    }>();

    expectTypeOf<PushParams<undefined, "/users">>().toEqualTypeOf<void>();

    expectTypeOf<PushParams<{ page: number }, "/users">>().toEqualTypeOf<{
      query: { page: number };
    }>();
  });
});
