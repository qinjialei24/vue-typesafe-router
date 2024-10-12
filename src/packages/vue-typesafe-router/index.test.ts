import { describe, it, expect, beforeEach, vi } from "vitest";
import { create, vueRouterKey, typesafeRouterPlugin } from "./index";
import { useRoute } from "vue-router";
import { getPath } from "./utils";

vi.mock("vue-router", () => ({
  useRoute: vi.fn(),
}));

describe("Typesafe Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    delete window[vueRouterKey];
  });

  describe("create", () => {
    it("should create a TypesafeRoute object", () => {
      const route = create({
        path: "/test",
        component: {} as any,
      }).defineQuery();

      expect(route).toHaveProperty("config");
      expect(route).toHaveProperty("getQuery");
      expect(route).toHaveProperty("getParams");
      expect(route).toHaveProperty("push");
    });

    it("getQuery should return correct query parameters", () => {
      const mockRoute = {
        query: { foo: "bar" },
      };
      vi.mocked(useRoute).mockReturnValue(mockRoute as any);

      const route = create({
        path: "/test",
        component: {} as any,
      }).defineQuery<{ foo: string }>();

      expect(route.getQuery()).toEqual({ foo: "bar" });
    });

    it("getParams should return correct dynamic parameters", () => {
      const mockRoute = {
        params: { id: "123" },
      };
      vi.mocked(useRoute).mockReturnValue(mockRoute as any);

      const route = create({
        path: "/test/:id",
        component: {} as any,
      });

      expect(route.getParams()).toEqual({ id: "123" });
    });

    it("push should call vueRouter.push method", () => {
      const mockPush = vi.fn();
      // @ts-ignore
      window[vueRouterKey] = { push: mockPush };

      const route = create({
        path: "/test",
        component: {} as any,
      }).defineQuery<{ foo: string }>();

      route.push({
        query: { foo: "bar" },
      });

      expect(mockPush).toHaveBeenCalledWith({
        path: "/test",
        query: { foo: "bar" },
      });
    });

    it("pushParamsAndQuery should call vueRouter.push method with correct params", () => {
      const mockPush = vi.fn();
      // @ts-ignore
      window[vueRouterKey] = { push: mockPush };

      const route = create({
        path: "/user/:id",
        component: {} as any,
      }).defineQuery<{
        foo: "bar";
      }>();

      route.push({ params: { id: "123" }, query: { foo: "bar" } });

      expect(mockPush).toHaveBeenCalledWith({
        path: "/user/123",
        query: { foo: "bar" },
      });
    });

    it("pushParams should call vueRouter.push method with correct params", () => {
      const mockPush = vi.fn();
      // @ts-ignore
      window[vueRouterKey] = { push: mockPush };

      const route = create({
        path: "/user/:id",
        component: {} as any,
      });

      route.push({ params: { id: "123" } });

      expect(mockPush).toHaveBeenCalledWith("/user/123");
    });
  });

  describe("getPath", () => {
    it("should correctly replace dynamic parameters", () => {
      const path = "/user/:id/profile/:tab";
      const params = { id: "123", tab: "info" };

      const result = getPath(path, params);

      expect(result).toBe("/user/123/profile/info");
    });

    it("should retain original placeholders when params are missing", () => {
      const path = "/user/:id/profile/:tab";
      const params = { id: "123" };

      const result = getPath(path, params);

      expect(result).toBe("/user/123/profile/:tab");
    });

    it("should correctly handle paths without dynamic parameters", () => {
      const path = "/user/profile";
      const params = { id: "123" };

      const result = getPath(path, params);

      expect(result).toBe("/user/profile");
    });

    it("should correctly handle empty paths", () => {
      const path = "";
      const params = { id: "123" };

      const result = getPath(path, params);

      expect(result).toBe("");
    });
  });

  describe("typesafeRouterPlugin", () => {
    it("should correctly install the plugin and set global property", () => {
      const mockApp = {
        config: {
          globalProperties: {
            $router: { foo: "bar" },
          },
        },
      };

      typesafeRouterPlugin.install(mockApp as any);

      // @ts-ignore
      expect(window[vueRouterKey]).toEqual({ foo: "bar" });
    });
  });
});
