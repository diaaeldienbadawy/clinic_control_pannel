import React, { cloneElement, useEffect } from 'react'
import { EditablePageVM } from '../../MyLib/Structure/ViewModels/Abstracts/EditablePageVM';
import { service } from '../../Structure/Models/service';
import { Prop } from '../../MyLib/Structure/ViewModels/Abstracts/Prop';
import { ServiceClient } from '../../Structure/Api/Clients/ServiceClient';
import { Notify } from '../../MyLib/Structure/Handlers/Notifications';
import { Col, Container, Row } from 'react-bootstrap';
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure';
import { navigator } from '../../MyLib/Components/Facilities';
import ServiceImage from './ServiceImage';
import ServiceTitle from './ServiceTitle';
import ServicePrice from './ServicePrice';
import ServicePrief from './ServicePrief';
import ServiceDescription from './ServiceDescription';
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs';
import { branch } from '../../Structure/Models/branch';
import { BranchClient } from '../../Structure/Api/Clients/BranchClient';
import CustomSelect from '../../MyLib/Components/CustomSelect';
import { branchEmployeeService } from '../../Structure/Models/branchEmployeeService';
import { UserProfile } from '../../Structure/Models/User';
import { branchEmployee } from '../../Structure/Models/branchEmployee';
import { useParams } from 'react-router-dom';

export const CreateServicePage = () => {
  const {id} = useParams<{id:string}>()
  const control = useVM<CreateServicePageVM>(new CreateServicePageVM())
  useEffect(()=>{control.initiate(id)},[])
  return (
    <Container>
        <Row className='justify-content-center pb-5'>
        {
            control.Show(
            <Col md={10}>
                <div className='d-flex py-3 w-100 justify-content-end'>
                    <div className='my-auto btn-delete c-pointer text-nowrap fs-5' onClick={()=>
                      Globals.popup.open({
                        title:'تنبيه',
                        content:'هل تريد حذف الخدمة ؟',
                        onAccept:()=>control.delete(()=>navigator.Services())
                      })
                      }> 
                      حذف الخدمة
                    </div>
                </div>
                
                <Row>
                <Col className='' md={6}>
                  <div className='pb-5 d-flex flex-column'>
                    <div className='ratio ratio-16x9 d-flex px-0 shadow rounded-2 overflow-hidden' style={{width:'100%' , height:'100%' , maxHeight:'600px'}} >
                        <ServiceImage value={control.ServiceImg} />
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className='p-2'>
                      <ServiceTitle subClass='fs-4' value={control.Title} deletable={false}/>
                      <ServicePrice subClass='fs-5 text-success' value={ control.price} deletable={false} />
                      <ServicePrief  subClass='color-gray' value={ control.Prief} deletable={false} />
                  </div>
                </Col>
                </Row>
                <Row className='pb-5'>
                  <ServiceDescription value={control.Description} deletable={false}></ServiceDescription>
                </Row>
                {/* <Row className='py-2'>
                  <div className='d-flex'>
                      <div className='my-auto'>ربط فرع</div>
                      <div className='px-2'>
                        <CustomSelect 
                          list={control.branchs.filter(a=>control.data.branch_employees && control.data.branch_employees.length>0?(!control.data.branch_employees.some(e=>e.branch_employee?.branch_id==a.id)):true).map(a=>({label:a.name,value:a.id as string}))} 
                          selected={control.branch?.id} 
                          onSelect={a=>control.branch = control.branchs.find(b=>b.id==a)}
                        />
                      </div>
                      <div className='my-auto px-2'>
                        <div className='material-symbols-outlined btn-clr-save c-pointer' onClick={()=>control.addBranch()}>
                          add
                        </div>
                      </div>
                  </div>
                </Row>
                {
                  control.branchs.map((branch,index)=>{
                    let emps = control.data.branch_employees?.filter(a=>a.branch_employee?(a.branch_employee.branch_id==branch.id):false)
                    if(emps && emps.length>0){
                      return(
                        <div className='p-2'>
                          <div className='p-2 rounded-3 border'>
                            <div className='d-flex justify-content-between'>
                              <h5 className='px-3'>{branch.name}</h5>
                              <div 
                                className='material-symbols-outlined btn-delete c-pointer' 
                                onClick={()=>{
                                  Globals.popup.open({
                                    content:
                                    <div className='h-100 d-flex flex-column'>
                                      <div className='h-100 d-flex flex-column justify-content-center'>
                                        <div>
                                          هل تريد الغاء ربط فرع {branch.name} ؟
                                        </div>
                                      </div>
                                      <div className='d-flex justify-content-center'> 
                                        <button className='button-I btn-clr-I c-pointer' onClick={()=>control.removeBranch(branch)}>موافق</button>
                                      </div>
                                    </div>
                                  })
                                }}
                              >delete</div>
                            </div>
                            <div className='border d-flex flex-wrap' style={{ minHeight:'100px' }}>
                              {
                                branch.employees?.map((emp,ind)=>(
                                  <div className='px-3 py-2 d-flex flex-column'>
                                    <div className='d-flex'>
                                      <div className='my-auto'>
                                        <input 
                                          type="checkbox" 
                                          checked={emps?.some(a=>a.branch_employee_id==emp.id)}  
                                          onChange={a=>a.target.checked?control.addEmployee(emp):control.removeEmployee(emp)}
                                          id={(branch.id??'')+(emp.id??'')} 
                                        />
                                      </div>
                                      <div className='px-2 my-auto'>
                                        <label htmlFor={(branch.id??'')+(emp.id??'')} >{emp.employee?.name}</label>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return(<></>)
                  })
                } */}
                <Row className='pb-5'>
                    <Col>
                      <button className='button-I btn-clr-II px-5 fs-5 fw-bold' onClick={()=>{control.send()}}>
                        حفظ الخدمة
                      </button>
                    </Col>
                 
                </Row>
            </Col>
          )
        }
        </Row>
    </Container>
  )
}

export class CreateServicePageVM extends EditablePageVM<service>{
    public Title:Prop<string> = new Prop<string>(()=>this.data.title ,(v:string)=>{this.data.title = v; this.data.slug=v.trim().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}-]+/gu, '') }, this)
    public Prief:Prop<string> = new Prop<string>(()=>this.data.prief ,(v:string)=>this.data.prief = v , this)
    public ServiceImg:Prop<string|File> = new Prop<string|File>(()=>this.data.service_img??null, (v:string|File)=>this.data.service_img=v , this)
    public price:Prop<number> = new Prop<number>(()=>this.data.price ,(v:number)=>this.data.price = v , this)
    public Description:Prop<string> = new Prop<string>(()=>this.data.description ,(v:string)=>this.data.description = v , this)

    
    private _branchs : branch[] =[];
    public get branchs() : branch[] {
      return this._branchs;
    }
    public set branchs(v : branch[]) {
      this._branchs = v;
    }
    
    
    private _branch : branch|undefined;
    public get branch() : branch|undefined {
      return this._branch;
    }
    public set branch(v : branch|undefined) {
      this._branch = v;
      this.update()
    }
    
    
    private _selectedBranchs : branch[] = [];
    public get selectedBranchs() : branch[] {
      return this._selectedBranchs;
    }
    public set selectedBranchs(v : branch[]) {
      this._selectedBranchs = v;
      this.update()
    }
    

    constructor(){
        let init = { title:'العنوان' , prief:'مقدمة مقدمة مقدمة مقدمة' , service_img:'' , price:0 , description:''} 
        super(init ,ServiceClient)
    }

    public async preInitiate(): Promise<void> {
        let branchs = await new BranchClient().getAll()
        if(branchs){
          this._branchs=branchs
        }
    }

    public async afterInitiate(): Promise<void> {
        
    }

    public send(): void {
        this.loading(async()=>{
          console.log(this.data)
            let response = await new this.clientType().insert(this.data)
            if(response){
                if(!this.data.id)this.data = this.initilaData
                navigator.Services()
                Notify({type:'success' , title:'عملية ناجحة' , body:'تمت العملية بنجاح'})
            }
            this.update()
        })
    }

    public addBranch(){
      /*if(this._branch){
        this._selectedBranchs = [...this._selectedBranchs, {...this._branch}]
        this._branch = undefined
        this.update()
      }*/
      this.loading(async()=>{
        if(this._branch?.employees){
          {
            this._branch.employees?.forEach(a=>{
              if(this._data.branch_employees)this._data.branch_employees.push({service_id:this._data.id,branch_employee_id:a.id,branch_employee:a})
              else this._data.branch_employees =[{service_id:this._data.id,branch_employee_id:a.id,branch_employee:a}]
            })
            this._branch = undefined
          }
        }
        this.update()
      })

    }
    public addEmployee(employee:branchEmployee){
      /*this._selectedBranchs = this._selectedBranchs.map(a=>{if(a.id==branch.id &&a.employees) a.employees.push(employee); return a})
      this.update()*/
      
      this._data.branch_employees = [...this._data.branch_employees??[],{service_id:this._data.id,branch_employee_id:employee.id,branch_employee:employee}] 
      this.update()
    }
    public removeEmployee(employee:branchEmployee){
      //this._selectedBranchs = this._selectedBranchs.map(a=>{if(a.id==branch.id && a.employees)a.employees=a.employees?.filter(e=>e.id!=employee.id); return a})
      //this.update()
      
      this._data.branch_employees = this._data.branch_employees?.filter(a=>a.branch_employee_id!=employee.id)
      this.update()
    }
    public removeBranch(branch:branch){
      if(this._data.branch_employees){
        this._data.branch_employees = this._data.branch_employees.filter(a=>a.branch_employee?.branch_id!=branch.id)
      }
      this.update()
    }
}