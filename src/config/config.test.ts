import { Environment, BaseConfig } from ".";
import { IAppConfig } from "./iappconfig";

export class TestConfig extends BaseConfig {

    constructor() {
        super(Environment.prod);
    }

    public DbConnectionString() {
        return {
            url: '13.71.81.138',
            user: 'wegotqa3',
            password: 'wegot@DB3',
            port: 3306,
            database: 'we2db'
        };
    }


    public appConfig(): IAppConfig {
        return {
            name: 'WEGOT API',
            version: '1.0.0',
            port: 3000,
            environment: Environment.prod.toString(),
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
