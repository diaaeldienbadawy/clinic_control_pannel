import { ListVM } from "../../../MyLib/Structure/ViewModels/Abstracts/ListVM";
import { SpecializationClient } from "../../Api/Clients/SpecializationClient";
import { specialization } from "../../Models/Specialization";

export class SpecializationsPageVM extends ListVM<specialization>{
    constructor(){
        super(SpecializationClient,false)
    }
}