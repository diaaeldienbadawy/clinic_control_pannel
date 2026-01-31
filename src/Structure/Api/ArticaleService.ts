import { AxiosService } from "../../MyLib/Structure/Handlers/AxiosService"
import { IPaginatedResponse } from "../../MyLib/Structure/Interfaces/ResponsesData"
import { Artical } from "../Models/Articale"

export class ArticaleService{
    private url:string = 'v1/artical'

    public async getArticals(page:string = '1'){
        const service = new AxiosService<{page:string},IPaginatedResponse<Artical>>()
        service.setEndPoint(this.url).addParameter({key:'page', value:page}).setRequestType('GET')
        return await service.build();
    }
}
