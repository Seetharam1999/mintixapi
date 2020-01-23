import { validate } from 'joi';

export class ValidatorHelper {
    public jsonValidator(joiSchema: object, jsonValue: any) {
        return new Promise((resolve, reject) => {
            validate(jsonValue, joiSchema, { stripUnknown: true })
                .then(res => {
                    resolve(res);
                }).catch(error => {
                    reject(new Error(error).toString());
                });
        });
    }
}
