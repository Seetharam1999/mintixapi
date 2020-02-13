import { BaseConfig } from ".";
import { IAppConfig } from "./iappconfig";

export class DevConfig extends BaseConfig {

    constructor() {
        super(process.env.Environment);
    }

    public DbConnectionString() {
        return {
            url: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: 3306,
            database: process.env.MYSQL_DB
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
            port: 3000,
            environment:process.env.Environment.toString(),
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
            key: "PXMAhrRAXIRuWPVVdU2P95a02dOFtDezwBTMCz/CFnRwKB5+CKN7PvPK4mSsTZRe3mz8lGEkNg2cRRPDq1ZEXw==",
            storageAccount: "mintix"
        }
    }
    public microServiceConfig() {
        return {
            notificationBaseURL: ''
        }
    }
}
