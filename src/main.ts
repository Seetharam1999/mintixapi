import { Config } from './config/config';
import { WebApi } from './webApi';
import { Environment } from './config/index';
import { mysql } from './helpers/mysql/mysql.config';

const env = require('get-env');
const currenv = env({
    development: [Environment[Environment.development]],
    qas: [Environment[Environment.qas]],
    prod: [Environment[Environment.prod]],
});
Config.setEnvironment(currenv);
const api = new WebApi();
api.run();
mysql.setConnection();
//mqttConfig.subscribe();
//mqttConfig.listen();
const app = api.app;
const appConfig = Config.getConfig().appConfig();
console.log(`listening ${appConfig.environment} environment on ${appConfig.port}`);
export { app };
