export type TMetricConfig = {
  token: string;
  accountId: string;
  userId: string;
}

export type TMResult = {
  id: number,
  startTime: string,
  endTime: string
}

export type Config = {
  hoursPerDay: number,
  daysPerWeek: number,
  tmetric: TMetricConfig
}

