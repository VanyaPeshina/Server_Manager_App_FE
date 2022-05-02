import { Server } from "http";

export interface CustomResponse {
    timeStamp: Date;
    statusCode: number;
    status: string;
    reason: string;
    message: string;
    developerMessage: string;
    // {} make an object
    // makes the parameters optional for the object
    data: { servers?: Server[], server?: Server};
}