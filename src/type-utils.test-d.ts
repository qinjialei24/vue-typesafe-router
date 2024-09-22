import { describe, expectTypeOf, test } from 'vitest'
import { PathParamsToObject, PushParams } from './type-utils'

describe('Type Utils', () => {
  // 测试 PathParamsToObject
  test('PathParamsToObject should correctly extract path parameters', () => {
    expectTypeOf<PathParamsToObject<"/user/:id">>()
      .toEqualTypeOf<{ id: string }>()

    expectTypeOf<PathParamsToObject<"/user/:id/posts/:postId">>()
      .toEqualTypeOf<{ id: string; postId: string }>()
  })

  // 测试 PushParams
  test('PushParams should correctly handle different scenarios', () => {
    // 有参数，无查询
    expectTypeOf<PushParams<undefined, "/user/:id">>()
      .toEqualTypeOf<{ params: { id: string } }>()

    // 有参数，有查询
    expectTypeOf<PushParams<{ page: number }, "/user/:id">>()
      .toEqualTypeOf<{ params: { id: string }; query: { page: number } }>()

    // 无参数，无查询
    expectTypeOf<PushParams<undefined, "/users">>()
      .toEqualTypeOf<void>()

    // 无参数，有查询
    expectTypeOf<PushParams<{ page: number }, "/users">>()
      .toEqualTypeOf<{ query: { page: number } }>()
  })
})
