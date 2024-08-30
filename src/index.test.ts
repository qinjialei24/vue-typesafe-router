import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTypesafeRoute, vueRouterKey } from './index';
import { Router, useRouter, useRoute } from 'vue-router';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn()
}));

describe('createTypesafeRoute', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    // Mock window object
    vi.stubGlobal('window', {});
  });

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

      const mockPush = vi.fn();
      const mockRouter = { push: mockPush };
      // @ts-ignore
      window[vueRouterKey] = mockRouter;

      route.push({ id: '123' });

      expect(mockPush).toHaveBeenCalledWith({
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

      const mockPush = vi.fn();
      const mockRouter = { push: mockPush };
      // @ts-ignore
      window[vueRouterKey] = mockRouter;

      route.push({
        id: '123',
        filters: ['category1', 'category2'],
        page: 2,
        sortBy: 'desc'
      });

      expect(mockPush).toHaveBeenCalledWith({
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

      const mockPush = vi.fn();
      const mockRouter = { push: mockPush };
      // @ts-ignore
      window[vueRouterKey] = mockRouter;

      route.push({ category: 'clothing' });

      expect(mockPush).toHaveBeenCalledWith({
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

      vi.mocked(useRoute).mockReturnValue({
        query: {
          id: '456',
          filters: ['brand1'],
          page: '3',
          sortBy: 'asc'
        }
      } as any);

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