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

    public PushNotification() {
        return {
            mqttUrl: 'mqtt://dev2.venaqua.com',
            subscribePath: 'Test/Apna/FA/LE/#'
        }
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

    public azureStorage() {
        return {
            key: 'PXMAhrRAXIRuWPVVdU2P95a02dOFtDezwBTMCz/CFnRwKB5+CKN7PvPK4mSsTZRe3mz8lGEkNg2cRRPDq1ZEXw==',
            storageAccount: 'wegotinvoices'
        }
    }
    public microServiceConfig() {
        return {
            notificationBaseURL: 'http://w2qa3.venaqua.com:3005'
        }
    }
}
