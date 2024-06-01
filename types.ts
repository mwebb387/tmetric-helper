export type TMetricConfig = {
  token: string;
  accountId: string;
  userId: string;
}

export type TMTimeResult = {
  id: number,
  startTime: string,
  endTime: string
}

export type Config = {
  hoursPerDay: number,
  daysPerWeek: number,
  ptoDaysPerYear: number,
  tmetric: TMetricConfig
}

export type TMPolicy = {
  id: number,
  name: string,
  iconUrl: string,
  color: string,
  requiresApproval: boolean,
}

export type ApprovalStatus = 'Approved' | 'NeedsApproval';

export type TMPerson = {
    timeZone: string,
    name: string,
    iconUrl: string,
    id: number,
}

export type TMRequestResult = {
  id: number,
  policy: TMPolicy,
  status: ApprovalStatus,
  requester: TMPerson,
  approver: TMPerson,
  requestDate: string,
  startDate: string,
  endDate: string,
  hours: number,
  workdays: number,
  description: string,
}
