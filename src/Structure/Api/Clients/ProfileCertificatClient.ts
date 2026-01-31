import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { profileCertificate } from "../../Models/profileCertificate";



export class ProfileCertificateClient extends AxiosClientRepository<profileCertificate>{
    protected endPoint: string = 'profile-certificate';
}