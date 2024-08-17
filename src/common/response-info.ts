export class ResponseInfo {
    statusCode: number;
    message: string;
    data: any;

    constructor(
        statusCode: number = 200,
        message: string = "Ok",
        data: any = {}
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
