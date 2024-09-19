// 提取路径中的参数名
type ExtractPathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<Rest>
    : T extends `${string}:${infer Param}`
    ? Param
    : never;

// 将提取的参数名转换为对象类型
type PathParamsToObject<T extends string> = {
  [K in ExtractPathParams<T>]: string;
};

// 检查路径是否包含动态参数
type HasParams<T extends string> = T extends `${string}:${string}` ? true : false;

// 根据是否有动态参数决定 PushParams 的结构
type PushParams<T extends string> = HasParams<T> extends true
  ? {
      params: PathParamsToObject<T>;
      query?: Record<string, string>;
    }
  : {
      query?: Record<string, string>;
    };

function test<T extends string>(path: T) {
  console.log("test");
  return {
    push(obj: PushParams<T>) {
      console.log("push", obj);
    },
  };
}

// 使用示例
const routeWithParams = test("123/:id/:id2");
routeWithParams.push({ params: { id: "123", id2: "456" }, query: { foo: "bar" } });

const routeWithoutParams = test("123/456");
routeWithoutParams.push({ query: { foo: "bar" } });