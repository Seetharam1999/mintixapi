import { IAppConfig } from "./iappconfig";

export abstract class BaseConfig {

    private environment;

    constructor(_environment) {
        this.environment = _environment;
    }

    abstract DbConnectionString(): {
        url: string,
        user: string,
        password: string,
        port: number,
        database: string
    };

    abstract PushNotification(): {
        mqttUrl: string,
        subscribePath: string,
    };

    abstract appConfig(): {
        name: string,
        version: string,
        port: number,
        environment: string,
        baseRoute: string
        baseTestRoute: string
    }

    abstract JSONWebToken(): {
        refreshToken: {
            expiresIn: string
        },
        accessToken: {
            expiresIn: string
        }
    }

    abstract azureStorage(): {
        key: string,
        storageAccount: string
    }

    abstract microServiceConfig(): {
        notificationBaseURL: string
    }
}
