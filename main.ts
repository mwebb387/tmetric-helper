import { formatTime, getPtoBalance, getTimeBallance } from './time.service.ts';
import { readConfig } from './config.service.ts';
import { Select } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/mod.ts';

const config = await readConfig('./timestream.json');

// import { Command } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts';

// await new Command()
//   .name('TimeStream')
//   .version('0.1.0')
//   .description('Helper utility for work time')
//   .parse(Deno.args);

type SelectOptions =
  | "Time ballance"
  | "PTO ballance"
;

const option: SelectOptions = await Select.prompt({
  message: "Pick an option",
  search: true,
  options: <SelectOptions[]>[
    'Time ballance',
    'PTO ballance',
  ],
}) as SelectOptions;

if (option === 'Time ballance') {

  const ballance = await getTimeBallance(config);

  console.log('Hours worked: ', formatTime(ballance.hoursWorked));
  console.log('Hours remaining: ', formatTime(ballance.hoursRemaining));
  ballance.hoursRemaining > 0
    ? console.log(`You will be finished working ${ballance.finished.toString()}`)
    : console.log('You are finished working!');

} else if (option === 'PTO ballance') {

  const ptoBallance = await getPtoBalance(config);

  console.log('PTO Days Approved: ', ptoBallance.approvedDays);

  if (ptoBallance.pendingDays > 0) {
    console.log('PTO Days Pending Approval: ', ptoBallance.pendingDays);
  }

  console.log('Total PTO Days Requested: ', ptoBallance.totalDaysRequested);
  console.log('Total PTO Days remaining: ', ptoBallance.totalDaysRemaining);
}
