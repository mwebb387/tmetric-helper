import { createService } from './tmetric.service.ts';
import { Config, TMResult } from './types.ts';

const formatDate = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export const getHours = (time: number) => time - (time - Math.floor(time))

export const getMinutes = (time: number) => Math.round((time - Math.floor(time)) * 60)

export const getBallance = async (config: Config) => {
  const tmetric = createService(config.tmetric);

  const now = new Date();
  console.log(now);

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
    (total: number, current: TMResult) =>
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