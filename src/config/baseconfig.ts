import { Environment } from "./index";
import { IAPPConfig } from "./iappconfig";

export abstract class baseConfig{

private environment: Environment;
constructor(_environemt:Environment){
this.environment=_environment;
}
abstract DbConnectionString():{
url:string,
user:string,
password:string,
port:string,
port:number,
database:string
};
abstract appConfig():{
name:string,
version:string,
port:number,
environment:string,
baseRoute:string,
baseTestRoute:string
};
abstract JSONWebToken(): {
        refreshToken: {
            expiresIn: string
        },
        accessToken: {
            expiresIn: string
        }
    } 
}
