import { Status } from "../enum/status.enums";

export interface Server {
    id: number;
    ipAdress: string;
    name: string;
    memory: string;
    type: string;
    imageUrl: string;
    status: Status;
}