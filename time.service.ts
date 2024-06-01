import { createService } from './tmetric.service.ts';
import { Config, TMTimeResult, TMRequestResult } from './types.ts';

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export const formatTime = (hours: number) => {
  const absHours = Math.abs(hours);
  const output = `${(getHours(absHours))}h ${(getMinutes(absHours))}m`;
  return hours >= 0
    ? output
    : `-(${output})`;
}

export const getHours = (time: number) => time - (time - Math.floor(time))

export const getMinutes = (time: number) => Math.round((time - Math.floor(time)) * 60)

export const getTimeBallance = async (config: Config) => {
  const tmetric = createService(config.tmetric);

  const now = new Date();

  //Get today's day offest
  const today = now.getDay();

  // Calculate the start and end of the current week (Sunday - Saturday)
  const weekStart = new Date();
  weekStart.setTime(now.getTime() - (today * 24 * 60 * 60 * 1000));

  const weekEnd = new Date();
  weekEnd.setTime(weekStart.getTime() + (6 * 24 * 60 * 60 * 1000));

  // Get base start and end dates to send to time tracking service
  const startDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
  const endDate = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate());

  // Get entries and current hours worked from the time tracking service
  const entries = await tmetric.getTimeEntries(formatDate(startDate), formatDate(endDate));
  const msCur = entries?.reduce(
    (total: number, current: TMTimeResult) =>
      total + (new Date(current.endTime ?? now.toString()).getTime() - new Date(current.startTime).getTime()),
    0) ?? 0;

  // Calculate current ballance in hours
  const hoursWorked = msCur / 1000 / 60 / 60;
  const hrsReq = Math.min(today, config.daysPerWeek) * config.hoursPerDay;
  const hoursRemaining = hrsReq - hoursWorked;

  // Calcualte when work will be finished for the day
  const finished = new Date();
  finished.setTime(now.getTime() + hoursRemaining * 60 * 60 * 1000);

  return {
    now,
    hoursWorked,
    hoursRemaining,
    finished,
  };
}

export const getPtoBalance = async (config: Config) => {
  const tmetric = createService(config.tmetric);

  const now = new Date()

  const yearStart = new Date(now.getFullYear(), 0, 1);
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1);

  const ptoRequests = await tmetric.getPtoEntries(formatDate(yearStart), formatDate(yearEnd));

  const approvedHours = ptoRequests
    ?.filter((req: TMRequestResult) => req.status === 'Approved')
    ?.reduce((total: number, req: TMRequestResult) => total + req.hours, 0)
    ?? 0;

  const pendingHours = ptoRequests
    ?.filter((req: TMRequestResult) => req.status === 'NeedsApproval')
    ?.reduce((total: number, req: TMRequestResult) => total + req.hours, 0)
    ?? 0;
  
  const approvedDays = approvedHours / config.hoursPerDay;
  const pendingDays = pendingHours / config.hoursPerDay;
  const totalDaysRequested = approvedDays + pendingDays;
  const totalDaysRemaining = config.ptoDaysPerYear - totalDaysRequested;

  return {
    approvedDays,
    pendingDays,
    totalDaysRequested,
    totalDaysRemaining,
  };
}
