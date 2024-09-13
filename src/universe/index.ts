interface UniverseConfig {
  getQuery: () => any;
  getParams: () => any;
  pushQuery: (query: any) => void;
  pushParamsAndQuery: (query: any, params: any) => void;
  pushParams: (params: any) => void;
}

type UniverseTypesafeRouteConfig<ComponentType> = {
  path: string;
  component: ComponentType;
};

interface UniverseTypesafeRoute<ComponentType> {
  createTypesafeRoute<
    T extends Record<string, string>,
    DynamicParams extends Record<string, string> = Record<string, never>
  >(
    routeConfig: UniverseTypesafeRouteConfig<ComponentType>
  ): UniverseTypesafeRoute<ComponentType>;
}

function createUniverse<ComponentType>(
  config: UniverseConfig
): UniverseTypesafeRoute<ComponentType> {
  const { getQuery, getParams, pushQuery, pushParamsAndQuery, pushParams } =
    config;

  function createTypesafeRoute<ComponentType>(): any {}

  return {
    createTypesafeRoute,
  };
}
