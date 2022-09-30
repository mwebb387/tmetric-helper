import { TMetricConfig, TMResult } from './types.ts'

// TODO: Update headers type...
const getRequest = (url: string, endpoint: string, headers: {Authorization: string}) =>
  fetch(`${url}/${endpoint}`, { headers });

export const createService = (config: TMetricConfig) => {
  const headers = {
    Authorization: `Bearer ${config.token}`
  };

  const url = `https://app.tmetric.com/api/v3/accounts/${config.accountId}`;

  return {
    getTimeEntries: (startDate: string, endDate: string) => {
      // TODO: Better construction of enpoint and params...
      const endpoint = `timeentries?userId=${config.userId}&startDate=${startDate}&endDate=${endDate}`;
      return getRequest(url, endpoint, headers)
        .then(response => response.json() as Promise<TMResult[]>);
    }
  }
}
