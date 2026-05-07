import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ScanPage = lazy(() => import("@/pages/ScanPage"));
const AnswerKeysPage = lazy(() => import("@/pages/AnswerKeysPage"));
const ResultsPage = lazy(() => import("@/pages/ResultsPage"));
const ResultDetailPage = lazy(() => import("@/pages/ResultDetailPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function PageFallback() {
  return (
    <div className="p-8 space-y-3">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <Dashboard />
    </Suspense>
  ),
});

const scanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/scan",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ScanPage />
    </Suspense>
  ),
});

const answerKeysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/answer-keys",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <AnswerKeysPage />
    </Suspense>
  ),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ResultsPage />
    </Suspense>
  ),
});

const resultDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results/$id",
  component: () => (
    <Suspense fallback={<PageFallback />}>
      <ResultDetailPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  scanRoute,
  answerKeysRoute,
  resultsRoute,
  resultDetailRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
