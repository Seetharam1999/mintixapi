import { Environment, BaseConfig } from ".";
import { IAppConfig } from "./iappconfig";

export class DevConfig extends BaseConfig {

    constructor() {
        super(Environment.development);
    }

    public DbConnectionString() {
        return {
            url: 'localhost',
            user: 'root',
            password: 'Karunyah',
            port: 3306,
            database: "mintixdb"
        };
    }

    public appConfig(): IAppConfig {
        return {
            name: 'WEGOT API',
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
