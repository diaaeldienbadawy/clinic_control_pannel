import { InterActive, useVM} from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { articalElementType } from '../../Structure/Models/Articale'
import { DoublePartArticalParagraphElementEditableText, DoublePartArticalElementEditableText, DoublePartArticalPointElementEditableText, DoublePartArticalVideoElementEditableText } from './DoublePartEditableText'
import { DoublePartArticalElementEditableFile } from './DoublePartEditableFile'
import { Prop } from '../../MyLib/Structure/ViewModels/Abstracts/Prop'
import { EditableArticalPageVM } from '../../Structure/ViewModels/Management/ArticalPage'

const EditableArticalElement = (props:{element:{type:articalElementType , content:string|File} , listVm:EditableArticalPageVM , onChange?:()=>void}) => {
  const control = useVM<EditableArticalElementVM>(new EditableArticalElementVM({element:props.element , listVm:props.listVm}))
  switch (control.element?.type){
    case 'subtitle' :{
      return (
        <div className=' w-100'>
          <DoublePartArticalElementEditableText subClass='color-I' value={control.content as Prop<string>} deletable onDelete={v=>control.deleteElement()}/>
        </div>
      )
    }
    case 'paragraph' :{
      return (
        <div className=' w-100'>
          <DoublePartArticalParagraphElementEditableText subClass='color-gray fs-4 fw-normal' value={control.content as Prop<string>} deletable onDelete={v=>control.deleteElement()}/>
        </div>
      )
    }
    case 'ul' :{
      return (
        <div className=' w-100'>
          <DoublePartArticalPointElementEditableText subClass='color-gray' value={control.content as Prop<string>} deletable onDelete={v=>control.deleteElement()}/>
        </div>
     )
    }
    case 'img' :{
      return (
        <div>
            <DoublePartArticalElementEditableFile value={control.content} deletable onDelete={(v)=>control.deleteElement()}/>
        </div>
      )
    }    
    case 'video' :{
      return (
        <div>
          <DoublePartArticalVideoElementEditableText subClass='color-gray fs-4 fw-normal' value={control.content as Prop<string>} deletable onDelete={v=>control.deleteElement()}/>
        </div>
      )
    }
    default: return (null)
  }
}

export default EditableArticalElement


class EditableArticalElementVM extends InterActive{
  public element:{type:articalElementType , content:string|File}
    public content:Prop<string|File> = 
      new Prop<string|File>(()=>this.element.content , (v:string|File)=>this.element.content=v , this)
     
    private _onChange : (()=>void)|undefined;
    public get onChange() : (()=>void)|undefined {
        return this._onChange;
    }
    public set onChange(v : (()=>void)|undefined) {
        this._onChange = v;
        this.update()
    }
    
    private _listVm :EditableArticalPageVM;
    public get listVm() : EditableArticalPageVM {
        return this._listVm;
    }
    public set listVm(v : EditableArticalPageVM) {
        this._listVm = v;
        this.update()
    }
    
    constructor(props:{element:{type:articalElementType , content:string|File}, listVm:EditableArticalPageVM , onChange?:()=>void }){
      super()
      this.element = props.element
      this._onChange = props.onChange
      this._listVm = props.listVm
    }

    public editElementValue(value:string|File){
        this.element.content = value
        this.listVm.editElement(this.element)
    }
    public deleteElement(){
      this.listVm.removeElement(this.element)
    }
}
