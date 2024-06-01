import { TMetricConfig, TMRequestResult, TMTimeResult } from './types.ts'

// TODO: Update headers type...
const getRequest = (url: string, endpoint: string, headers: {Authorization: string}) =>
  fetch(`${url}/${endpoint}`, { headers });

export const createService = (config: TMetricConfig) => {
  const headers = {
    Authorization: `Bearer ${config.token}`
  };

  const url = `https://app.tmetric.com/api/v3/accounts/${config.accountId}`;

  return {
    getTimeEntries: async (startDate: string, endDate: string) => {
      // TODO: Better construction of enpoint and params...
      const endpoint = `timeentries?userId=${config.userId}&startDate=${startDate}&endDate=${endDate}`;

      try {
        const response = await getRequest(url, endpoint, headers);
        return await (response.json() as Promise<TMTimeResult[]>);
      } catch (exception) {
        console.log(exception);
        return null;
      }
    },

    getPtoEntries: async (startDate: string, endDate: string) => {
      // TODO: Better construction of enpoint and params...
      const endpoint = `timeoff/requests?startDate=${startDate}&endDate=${endDate}&requesterList=${config.userId}&statusList=needsApproval&statusList=approved`;

      try {
        const response = await getRequest(url, endpoint, headers);
        return await (response.json() as Promise<TMRequestResult[]>);
      } catch (exception) {
        console.log(exception);
        return null;
      }
    }
  }
}
