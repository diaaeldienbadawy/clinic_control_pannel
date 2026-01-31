import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { profileResearch } from "../../Models/profileResearch";



export class ProfileResearchClient extends AxiosClientRepository<profileResearch>{
    protected endPoint: string = 'profile-research';
}