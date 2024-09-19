// 提取路径中的参数名
type ExtractPathParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ExtractPathParams<Rest>
  : T extends `${string}:${infer Param}`
  ? Param
  : never;

// 将提取的参数名转换为对象类型
type PathParamsToObject<T extends string> = {
  [K in ExtractPathParams<T>]: string;
};

function test<T extends string>(path: T) {
  console.log("test");
  return {
    push(obj: { params: PathParamsToObject<T> }) {
      console.log("push", obj);
    },
  };
}

// 使用示例
const route = test("123/:id/:id2");
route.push({ params: { id: "123", id2: "123", } }); // 正确
// route.push({ params: { foo: "bar" } }); // 类型错误