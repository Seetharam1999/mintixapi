import { Environment, BaseConfig } from ".";
import { IAppConfig } from "./iappconfig";

export class DevConfig extends BaseConfig {

    constructor() {
        super(Environment.development);
    }

    public DbConnectionString() {
        return {
            url: '18.219.51.148',
            user: 'mintix',
            password: 'mintixsql',
            port: 3306,
            database: "mintixdb"
        };
    }

    public PushNotification() {
        return {
            mqttUrl: '',
            subscribePath: ''
        }
    }

    public appConfig(): IAppConfig {
        return {
            name: 'WEGOT API',
            version: '1.0.0',
            port: 3002,
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
	public azureStorage() {
        return {
            key: "",
            storageAccount: ""
        }
    }
    public microServiceConfig() {
        return {
            notificationBaseURL: ''
        }
    }
}
