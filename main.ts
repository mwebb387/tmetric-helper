import { getBallance } from './time.service.ts';
import { readConfig } from './config.service.ts';

const config = await readConfig('./timestream.json');

const ballance = await getBallance(config);

console.log('Hours worked: ', ballance.hoursWorked);
console.log('Hours remaining: ', ballance.hoursRemaining);
ballance.hoursRemaining > 0
  ? console.log(`You will be finished working ${ballance.finished.toString()}`)
  : console.log('You are finished working!');


// import { Command } from 'https://deno.land/x/cliffy@v0.24.2/command/mod.ts';

// await new Command()
//   .name('TimeStream')
//   .version('0.1.0')
//   .description('Helper utility for work time')
//   .parse(Deno.args);
