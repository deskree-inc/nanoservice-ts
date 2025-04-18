import { Command } from 'commander';
import { logSuccess } from '../logger';

const helloAndrea = new Command('hello-andrea')
  .description('Say hello from Andrea!')
  .action(() => {
    logSuccess('Hello from Andrea 👋 You’ve just added your first CLI command!');
  });

export default helloAndrea;
