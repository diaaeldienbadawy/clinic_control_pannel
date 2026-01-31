import { AxiosClientRepository} from "../../../MyLib/Structure/Handlers/AxiosClient";
import { beforeAndAfterCategory } from "../../Models/beforeAndAfterCategory";

export class BeforeAndAfterCategoryClient extends AxiosClientRepository<beforeAndAfterCategory>{
    protected endPoint: string = 'before_and_after_category';
}