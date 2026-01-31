import { AxiosClientRepository } from "../../../MyLib/Structure/Handlers/AxiosClient";
import { subService } from "../../Models/subService";

export class SubServiceClient extends AxiosClientRepository<subService>{
    protected endPoint: string = 'sub-service';
}