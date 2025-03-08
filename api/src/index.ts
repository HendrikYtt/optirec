import { SERVICE } from './config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
void require(`./services/${SERVICE}`).start();
