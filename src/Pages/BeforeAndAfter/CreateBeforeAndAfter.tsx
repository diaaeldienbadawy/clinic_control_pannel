import React, { FC, useRef } from 'react'
import { InterActive, useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { CreateBeforeAndAfterCategoryVM } from './CreateBeforeAndAfterCategory'
import { beforeAndAfter } from '../../Structure/Models/beforeAndAfter'
import { beforeAndAfterPhoto } from '../../Structure/Models/beforeAndAfterPhoto'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'

export const BeforeAndAfter:FC<{vm?:BeforeAndAfterVM, category:CreateBeforeAndAfterCategoryVM}> = ({vm,category}) => {
  const control = useVM<BeforeAndAfterVM>(vm??new BeforeAndAfterVM({}))
  const addImage = useRef<HTMLInputElement>(null)

  return (
    <div className=' glass-effect-II p-2'>
      <div className='row'>
        <div className='d-flex justify-content-center p-1 col-md-6'>
          <input type="text" className='input-field w-100' value={control.title} onChange={a=>control.title=a.target.value} placeholder='عنوان القسم' />
        </div>
        <div className='d-flex justify-content-end p-1 col-md-6'>
          <div className='material-symbols-outlined c-pointer btn-delete'
            onClick={()=>Globals.popup.open({
              content:
              <div className='d-flex flex-column justify-content-between h-100'>
                <div className='d-flex flex-column justify-content-center h-100'>
                  هل تريد حذف القسم ؟ 
                </div>
                <div className='d-flex justify-content-center'>
                  <button className='button-I btn-clr-I bg-danger px-3 py-1'
                    onClick={()=>{
                      category.removeBeforeAndAfter(control)
                      Globals.popup.close()
                    }}
                  >موافق</button>
                </div>
              </div>
              })
            }
          >delete</div>
        </div>
      </div>

      <div className='w-100 d-flex justify-content-center p-1'>
        <textarea className='w-100 input-field' 
          value={control.description?.replaceAll('</br>','\n')} 
          onChange={a=>control.description = a.target.value.replaceAll('\n','</br>')} 
          placeholder='وصف القسم'  
        />
      </div>
        <div className='d-flex color-III c-pointer' onClick={()=>{ addImage.current?.click() }}>
          <div className='px-1 my-auto fs-4 fw-bold my-auto'>+</div>
          <div className='px-1 my-auto fs-5 my-auto'>اضافة</div>
          <input ref={addImage} type='file' className='d-none' value={undefined} onChange={a=>{ control.addPhoto(a.target.files?a.target.files[0]:undefined); if(addImage.current)addImage.current.value='' }}></input>
        </div>
      <div className='d-flex flex-wrap justify-content-start py-3'>
        {
          control.photos.map((item,index)=>(
            <div className=' p-2 d-flex'>
              <div className='position-relative d-flex ratio ratio-16x9 shadow overflow-hidden rounded-3' style={{ width:'100px' }}>
                <img className=' w-100 h-100' src={(item.before_and_after_img instanceof File)? URL.createObjectURL(item.before_and_after_img):item.before_and_after_img} />
                <div 
                  className='position-absolute material-symbols-outlined c-pointer btn-delete rounded-1 overflow-hidden' 
                  style={{ top:'5px' , left:'5px' , width:'20px' , height:'20px', paddingTop:'1px' , fontSize:'19px' ,color:'white' , background:'rgba(250,100,100,0.8)' }} 
                  onClick={()=>control.removePhoto(item.before_and_after_img)}>close</div>
              </div>
            </div>
          ))
        }
      </div>
      {/* <div className='d-flex justify-content-center'>
        <button className=' button-I btn-clr-I c-pointer px-3 py-1' onClick={()=>category.addBeforeAndAfter({title:control.title , description:control.description , before_and_after_photos:control.photos.map(photo=>({before_and_after_img:photo}))})}>حفظ</button>
      </div> */}
    </div>
  )
}

export class BeforeAndAfterVM extends InterActive{

  
  private _id : string|undefined;
  public get id() : string|undefined {
    return this._id;
  }
  public set id(v : string|undefined) {
    this._id = v;
  }
  

  private _title : string|undefined;
  public get title() : string|undefined {
    return this._title;
  }
  public set title(v : string|undefined) {
    this._title = v;
    this.update()
  }

  private _description : string|undefined;
  public get description() : string|undefined {
    return this._description;
  }
  public set description(v : string|undefined) {
    this._description = v;
    this.update()
  }
  
  private _photos : (beforeAndAfterPhoto)[] =[];
  public get photos() : (beforeAndAfterPhoto)[] {
    return this._photos;
  }
  public set photos(v : (beforeAndAfterPhoto)[]) {
    this._photos = v;
    this.update()
  }

  constructor(ini:beforeAndAfter){
    super()
    this.id = ini.id;
    this._title = ini.title;
    this._description = ini.description
    this._photos = ini.before_and_after_photos??[]
  }
  
  public addPhoto(photo?:File){
    if(photo){
      this._photos.push({before_and_after_img:photo})
      this.update()
    }
  }

  public removePhoto(photo:File|string){
    this._photos = this._photos.filter(a=>a.before_and_after_img!=photo)
    this.update()
  }

  public represent():beforeAndAfter{
    return {
      id:this.id,
      title:this.title,
      description:this.description,
      before_and_after_photos:this.photos
    }
  }

}
