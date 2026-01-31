import { ViewModel } from "../../Utilities/ViewModelStructure"

export class Prop<T>{
    private getter:()=>T
    private setter:(v:T)=>void
    private viewModel:ViewModel
    public get Value():T { return this.getter()}
    public set Value(v:T){ this.setter(v); this.viewModel.update() }

    constructor(getter:()=>T, setter:(v:T)=>void , viewModel:ViewModel){
        this.getter = getter 
        this.setter=setter
        this.viewModel = viewModel
    }
}