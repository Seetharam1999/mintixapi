import { Environment } from "./index";
import { IAppConfig } from "./iappconfig";

export abstract class BaseConfig {

    private environment: Environment;

    constructor(_environment: Environment) {
        this.environment = _environment;
    }

    abstract DbConnectionString(): {
        url: string,
        user: string,
        password: string,
        port: number,
        database: string
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

}
