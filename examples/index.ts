import { createTypesafeRoute } from "../src";

const route = createTypesafeRoute({
  path: "/test/:id?name=bob&age=20",
  component: {} as any,
});

route.push({ params: { id: "123" }, query: { foo: "bar" } });
