export interface ReaderRuntime {
  bumpSession: () => number;
  bumpView: () => number;
  isSessionStale: (runId: number) => boolean;
  isViewStale: (runId: number) => boolean;
  sessionId: () => number;
  viewId: () => number;
}

export function createReaderRuntime(): ReaderRuntime {
  let sessionId = 0;
  let viewId = 0;

  return {
    bumpSession: () => {
      sessionId += 1;
      viewId += 1;
      return sessionId;
    },
    bumpView: () => {
      viewId += 1;
      return viewId;
    },
    isSessionStale: runId => runId !== sessionId,
    isViewStale: runId => runId !== viewId,
    sessionId: () => sessionId,
    viewId: () => viewId,
  };
}
