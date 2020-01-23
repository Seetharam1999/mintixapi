import { Environment, BaseConfig } from ".";
import { IAppConfig } from "./iappconfig";

export class DevConfig extends BaseConfig {

    constructor() {
        super(Environment.development);
    }

    public DbConnectionString() {
        return {
            url: '18.191.218.211',
            user: 'root',
            password: 'Mysql@wegot123',
            port: 3306,
            database: "mintixdb"
        };
    }

   

    public appConfig(): IAppConfig {
        return {
            name: 'WEGOT MINTIX API',
            version: '1.0.0',
            port: 3000,
            environment: Environment.development.toString(),
            baseRoute: '/api',
            baseTestRoute: '/api/test',
        };
    }

    public JSONWebToken() {
        return {
            refreshToken: {
                expiresIn: "30d"
            },
            accessToken: {
                expiresIn: "600000"
            }
        }
    }
}
