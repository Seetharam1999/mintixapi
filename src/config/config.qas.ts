import { Environment, BaseConfig } from ".";
import { IAppConfig } from "./iappconfig";

export class QaSConfig extends BaseConfig {

    constructor() {
        super(Environment.qas);
    }

    public DbConnectionString() {
        return {
            url: 'localhost',
            user: 'root',
            password: '',
            port: 3306,
            database: ''
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
            environment: Environment.qas.toString(),
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
            key: '',
            storageAccount: ''
        }
    }
    public microServiceConfig() {
        return {
            notificationBaseURL: ''
        }
    }
}
