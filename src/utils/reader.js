import { outpost } from "./outpost";

export function createReader() {
  let isScheduleCompleted = false;
  let blocks = [];
  let user = {};
  let toc = [];

  const getTOC = () => toc;
  const getBlocks = () => blocks;
  const getName = () => user.name;
  const getBlockReached = () => user.blockReached;
  const getIsScheduleCompleted = () => isScheduleCompleted;

  const load = (data) => {
    ({ isScheduleCompleted, user, blocks, toc } = data);
  };

  const logout = async (tenantId) => {
    const url = '/logout';
    const options = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      }
    };

    const response = await outpost(url, options);
    window.location.reload();
  }

  return { load, logout, getTOC, getName, getBlocks, getBlockReached, getIsScheduleCompleted };
}