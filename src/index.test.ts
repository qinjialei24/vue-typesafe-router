import { describe, it, expect, vi } from 'vitest';
import { createTypesafeRoute } from './index';
import { useRouter } from 'vue-router';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}));

describe('createTypesafeRouter', () => {
  it('should create a router', () => {
    const route = createTypesafeRoute({
      path: '/',
      component: {}
    });
    expect(route).toBeDefined();
    expect(route.config).toBeDefined();
  });

  it('should handle complex query parameters', () => {
    const route = createTypesafeRoute<{
      id: string;
      filters: string[];
      page: number;
      sortBy: 'asc' | 'desc';
    }>({
      path: '/products',
      component: {}
    });

    expect(route.config.path).toBe('/products');

    const mockRouter = {
      push: vi.fn(),
      currentRoute: {
        value: {
          query: {
            id: '456',
            filters: ['brand1'],
            page: '3',
            sortBy: 'asc'
          }
        }
      }
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    // Test push method with complex query
    route.push({
      id: '123',
      filters: ['category1', 'category2'],
      page: 2,
      sortBy: 'desc'
    });

    expect(mockRouter.push).toHaveBeenCalledWith({
      path: '/products',
      query: {
        id: '123',
        filters: ['category1', 'category2'],
        page: 2,
        sortBy: 'desc'
      }
    });

    // Test getQuery method
    const query = route.getQuery();
    expect(query).toEqual({
      id: '456',
      filters: ['brand1'],
      page: '3',
      sortBy: 'asc'
    });
  });

  it('should handle routes with path parameters', () => {
    const route = createTypesafeRoute<{
      category: string;
      subcategory?: string;
    }>({
      path: '/category/:category/:subcategory?',
      component: {}
    });

    expect(route.config.path).toBe('/category/:category/:subcategory?');

    const mockRouter = {
      push: vi.fn(),
      currentRoute: {
        value: {
          query: {}
        }
      }
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    // Test push method with path parameters
    route.push({
      category: 'electronics',
      subcategory: 'laptops'
    });

    expect(mockRouter.push).toHaveBeenCalledWith({
      path: '/category/:category/:subcategory?',
      query: {
        category: 'electronics',
        subcategory: 'laptops'
      }
    });

    // Test push method without optional parameter
    route.push({
      category: 'clothing'
    });

    expect(mockRouter.push).toHaveBeenCalledWith({
      path: '/category/:category/:subcategory?',
      query: {
        category: 'clothing'
      }
    });
  });
});