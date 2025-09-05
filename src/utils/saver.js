import { outpost } from "./outpost";

export function createSaver() {
  let tenantId = null;

  let inFlight = false;
  let isPending = false;

  let failed = false;
  let failureCount = 0;

  const getFailed = () => failed;
  const getIsPending = () => isPending;
  const getFailureCount = () => failureCount;

  
  const init = (tenant_id) => {
    tenantId = tenant_id;
  };

  const save = async (blockReached) => {    
    if (failed) {
      return; // permanent failure
    }

    if (inFlight) { // previous request still in progress
      isPending = true; // for the UI to show stalling
      return;
    }

    inFlight = true;
    isPending = false;

    try {
      const url = '/newpage';
      const options = { 
        method: 'PATCH', 
        headers: { 
          'Content-Type': 'application/json',
          'x-block-reached': blockReached,
          'x-tenant-id': tenantId,
        } 
      };

      const response = await outpost(url, options);

      if (response.isErr()) {
        failureCount++;
        if (failureCount >= 5) {
          failed = true; // permanent failure
        }
      } else {
        failureCount = 0;
      }
    } finally {
      inFlight = false
    }
  } 

  return { init, save, getFailed, getIsPending, getFailureCount }
}