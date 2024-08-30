import { describe, it, expect, vi } from 'vitest';
import { createTypesafeRoute } from './index';
import { useRouter } from 'vue-router';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}));

describe('createTypesafeRoute', () => {
  it('should create a route with correct config', () => {
    const route = createTypesafeRoute({
      path: '/',
      component: {}
    });
    expect(route).toBeDefined();
    expect(route.config).toEqual({ path: '/', component: {} });
  });

  describe('push method', () => {
    it('should call router.push with correct path and query', () => {
      const route = createTypesafeRoute<{ id: string }>({
        path: '/products',
        component: {}
      });

      const mockRouter = { push: vi.fn() };
      vi.mocked(useRouter).mockReturnValue(mockRouter);

      route.push({ id: '123' });

      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/products',
        query: { id: '123' }
      });
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

      const mockRouter = { push: vi.fn() };
      vi.mocked(useRouter).mockReturnValue(mockRouter);

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
    });

    it('should handle optional query parameters', () => {
      const route = createTypesafeRoute<{
        category: string;
        subcategory?: string;
      }>({
        path: '/category',
        component: {}
      });

      const mockRouter = { push: vi.fn() };
      vi.mocked(useRouter).mockReturnValue(mockRouter);

      route.push({ category: 'clothing' });

      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/category',
        query: { category: 'clothing' }
      });
    });
  });

  describe('getQuery method', () => {
    it('should return current route query', () => {
      const route = createTypesafeRoute<{
        id: string;
        filters: string[];
        page: string;
        sortBy: string;
      }>({
        path: '/products',
        component: {}
      });

      const mockRouter = {
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

      const query = route.getQuery();
      expect(query).toEqual({
        id: '456',
        filters: ['brand1'],
        page: '3',
        sortBy: 'asc'
      });
    });
  });
});