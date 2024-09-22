//extract the params name from path
type ExtractPathParams<T extends string> =
    T extends `${string}:${infer Param}/${infer Rest}`
        ? Param | ExtractPathParams<Rest>
        : T extends `${string}:${infer Param}`
            ? Param
            : never;

//transform params name to object type
export type PathParamsToObject<T extends string> = {
    [K in ExtractPathParams<T>]: string;
};

//check if path has params
type HasParams<T extends string> = T extends `${string}:${string}`
    ? true
    : false;

//change PushParams 类型
export type PushParams<Query, Params extends string> = HasParams<Params> extends true
    ? Query extends undefined
        ? { params: PathParamsToObject<Params> }
        : { params: PathParamsToObject<Params>; query: Query }
    : Query extends undefined
        ? void
        : { query: Query };
