import { getBallance, getHours, getMinutes } from './time.service.ts';
import { readConfig } from './config.service.ts';

const config = await readConfig('./timestream.json');

const ballance = await getBallance(config);

console.log('Hours worked: ', `${(getHours(ballance.hoursWorked))}h ${(getMinutes(ballance.hoursWorked))}m`);
console.log('Hours remaining: ', `${(getHours(ballance.hoursRemaining))}h ${(getMinutes(ballance.hoursRemaining))}m`);
ballance.hoursRemaining > 0
  ? console.log(`You will be finished working ${ballance.finished.toString()}`)
  : console.log('You are finished working!');


// import { Command } from 'https://deno.land/x/cliffy@v0.24.2/command/mod.ts';

// await new Command()
//   .name('TimeStream')
//   .version('0.1.0')
//   .description('Helper utility for work time')
//   .parse(Deno.args);
