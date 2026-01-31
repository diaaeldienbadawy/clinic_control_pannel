import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { Artical, ArticalElement } from "../../Models/Articale";

export class ArticalElementClient extends AxiosClientRepository<ArticalElement>{
    protected endPoint: string = 'artical-element';
}