import { initEdgeStore } from "@edgestore/shared";
import { initEdgeStoreClient } from "@edgestore/server/core";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";

const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket().beforeDelete(({ ctx, fileInfo }) => {
    console.log("beforeDelete", ctx, fileInfo);
    return true; // allow delete
  }),
});

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  //   createContext: () => ({}),
});

export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});

export type EdgeStoreRouter = typeof edgeStoreRouter;
