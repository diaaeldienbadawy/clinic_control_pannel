import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { heroSection } from "../../Models/heroSection";
import { period } from "../../Models/period";

export class HeroSectionClient extends AxiosClientRepository<heroSection>{
    protected endPoint: string = 'hero';
}