import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { profileExperience } from "../../Models/profileExperience";



export class ProfileExperienceClient extends AxiosClientRepository<profileExperience>{
    protected endPoint: string = 'profile-experience';
}