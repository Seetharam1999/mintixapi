
import { Config } from './config/config';
import { WebApi } from './webApi';
import { mysql } from './helpers/mysql/mysql.config';

const env = require('dotenv').config();


Config.setEnvironment(process.env.Environment);
const api = new WebApi();
api.run();
mysql.setConnection();
const app = api.app;
const appConfig = Config.getConfig().appConfig();
console.log(`listening ${process.env.Environment} environment on ${process.env.APP_PORT}`);
export { app };
