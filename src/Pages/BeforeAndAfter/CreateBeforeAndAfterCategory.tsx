import React, { useEffect } from 'react'
import { EditablePageVM } from '../../MyLib/Structure/ViewModels/Abstracts/EditablePageVM'
import { beforeAndAfterCategory } from '../../Structure/Models/beforeAndAfterCategory'
import { BeforeAndAfterCategoryClient } from '../../Structure/Api/Clients/BeforeAndAfterCategoryClient'
import { Container, Row , Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { EditableBranchPageVM } from '../Branchs/CreateBranchPage'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { BeforeAndAfter, BeforeAndAfterVM } from './CreateBeforeAndAfter'
import { beforeAndAfter } from '../../Structure/Models/beforeAndAfter'
import { Notify } from '../../MyLib/Structure/Handlers/Notifications'
import { navigator } from '../../MyLib/Components/Facilities'

export const CreateBeforeAndAfterCategory = () => {
  const {id} = useParams<{id:string}>()
  const control = useVM<CreateBeforeAndAfterCategoryVM>(new CreateBeforeAndAfterCategoryVM())
  useEffect(()=>{control.initiate() },[])
  useEffect(()=>{ console.log(control.data) },[control.data])

  return (
    <Container  className='py-5' style={{ minHeight:'100%' }}>
      {
        control.Show(
          <div className='d-flex flex-column justify-content-between h-100'>
            <div className='h-100'>
                <h3 className='text-center'>البوم خدمات</h3>
                <Row className='p-0 m-0'>
                  <Col className=' py-3' lg={6}>
                      <div className='w-100 d-flex justify-content-center'>
                        <input className='w-100 input-field' 
                          type="text" 
                          value={control.data.title} 
                          onChange={a=>control.Title = a.target.value} 
                          placeholder='اسم الالبوم'  
                        />
                      </div>
                  </Col>
                </Row>
                <Row className='p-0 m-0'>
                  <Col className=' py-3' lg={12}>
                    <div className='w-100 d-flex justify-content-center'>
                      <textarea className='w-100 input-field' 
                        value={control.data.description?.replaceAll('</br>','\n')} 
                        onChange={a=>control.Description = a.target.value.replaceAll('\n','</br>')} 
                        placeholder='وصف الالبوم'  
                      />
                    </div>
                  </Col>
                </Row>
                <div className='p-3'>
                  <div className='border '>
                    <div className='d-flex color-III c-pointer p-2'
                      onClick={()=>{ control.addBeforeAndAfter() }}
                    >
                      <div className='px-1 my-auto fs-4 fw-bold'>+</div>
                      <div className='px-1 my-auto fs-5'>اضافة قسم صور</div>
                    </div>
                    {
                    control.beforeAndAfters.map((item,index)=>(
                      <div className='p-1'>
                        <BeforeAndAfter vm={item} category={control}/>
                      </div>
                    ))
                    }
                  </div>
                </div>
            </div>
            <div className='d-flex justify-content-center'>
              <button className='button-I btn-clr-II px-5 py-1 c-pointer' onClick={()=>control.save()}>حفظ</button>
            </div>
          </div>
        )
      }
    </Container>
  )
}

export class CreateBeforeAndAfterCategoryVM extends EditablePageVM<beforeAndAfterCategory>{
  public async preInitiate(): Promise<void> {}

  public async afterInitiate(): Promise<void> {
    this.beforeAndAfters = this.data.before_and_afters?.map(item=>new BeforeAndAfterVM(item))??[]
  }

  constructor(){
    super({},BeforeAndAfterCategoryClient)
  }

  public set Title(v:string){ this.data.title = v; this.update() }
  public set Description(v:string){ this.data.description = v; this.update() }

  public beforeAndAfters:BeforeAndAfterVM[] = []

  public addBeforeAndAfter(){
    if(this.beforeAndAfters)this.beforeAndAfters.push(new BeforeAndAfterVM({})); else this.beforeAndAfters =[new BeforeAndAfterVM({})];
    this.update()
  }
  public removeBeforeAndAfter(item:BeforeAndAfterVM){
    this.beforeAndAfters = this.beforeAndAfters.filter(a=>a!=item)
    this.update()
  }

  public save(){
    this.loading(async()=>{
      this.data.before_and_afters = this.beforeAndAfters.map(item=>item.represent())
      console.log(this.data)
      const result = await new this.clientType().insert(this.data)
      if(result){
        Notify({type:'success' , title:""  ,body:'عملية ناجحة'})
        navigator.BeforeAndAfterCategories()
      }
    })
  }
}

