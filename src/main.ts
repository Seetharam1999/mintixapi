import { Config } from './config/config';
import { WebApi } from './webApi';
import { Environment } from './config/index';
import { mysql } from './helpers/mysql/mysql.config';
import { MqttConfig } from './helpers/notification/mqtt.config'

const env = require('get-env');
const currenv = env({
    development: [Environment[Environment.development]],
    qas: [Environment[Environment.qas]],
    prod: [Environment[Environment.prod]],
});
Config.setEnvironment(currenv);
const api = new WebApi();
const mqttConfig = new MqttConfig();
api.run();
mysql.setConnection();
//mqttConfig.subscribe();
//mqttConfig.listen();
const app = api.app;
const appConfig = Config.getConfig().appConfig();
console.log(`listening ${appConfig.environment} environment on ${appConfig.port}`);
export { app };
