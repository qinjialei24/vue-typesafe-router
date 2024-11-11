import { create } from "../src";

//params route
const paramsRoute = create({
  path: "/post/:id",
  component: {},
});
paramsRoute.push({ params: { id: "456" } }); // 提供id

//get params
const params = paramsRoute.getParams();
console.log(params.id);

enum Gender {
  Male = "male",
  Female = "female",
}

//query route
const queryParamRoute = create({
  path: "/search",
  component: {},
}).defineQuery<{ gender: Gender; id: number }>();
queryParamRoute.push({ query: { gender: Gender.Male, id: 1 } });

//get query
const query = queryParamRoute.getQuery();
console.log(query.gender);
console.log(query.id);

//mixed route
const mixedRoute = create({
  path: "/product/:category/:id",
  component: {},
}).defineQuery<{ name: string; id: string }>();
mixedRoute.push({
  params: { category: "electronics", id: "789" },
  query: { name: "test", id: "123" },
});

//get params
const mixedRouteParams = mixedRoute.getParams();
console.log(mixedRouteParams.category);
console.log(mixedRouteParams.id);

// @ts-expect-error
console.log(mixedRouteParams.id2);

//get query
const mixedRouteQuery = mixedRoute.getQuery();
console.log(mixedRouteQuery.name);
console.log(mixedRouteQuery.id);
