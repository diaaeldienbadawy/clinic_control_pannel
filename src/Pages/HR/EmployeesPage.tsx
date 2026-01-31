import React, { useEffect, useState } from 'react'
import { ListVM, PaginatedListVM } from '../../MyLib/Structure/ViewModels/Abstracts/ListVM'
import { User, UserProfile } from '../../Structure/Models/User'
import { EditableItemVM } from '../../MyLib/Structure/ViewModels/Abstracts/EditableItemVM'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Col, Row } from 'react-bootstrap'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import { specialization } from '../../Structure/Models/Specialization'
import { Role } from '../../Structure/Models/Role'
import { SpecializationClient } from '../../Structure/Api/Clients/SpecializationClient'
import { RoleClient } from '../../Structure/Api/Clients/RoleClient'
import CustomSelect from '../../MyLib/Components/CustomSelect'
import { EmployeeClient } from '../../Structure/Api/Clients/EmployeeClient'
import CustomPhoneInput from '../../MyLib/Components/CustomPhoneInput'
import { navigator } from '../../MyLib/Components/Facilities'
import Pagination from '../../Components/Utilities/Pagination'
import { useLocation } from 'react-router-dom'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { UserAdminClient } from '../../Structure/Api/Clients/UserAdminClient'

export const EmployeesPage = () => {
  const control = useVM<EmployeesPageVM>(new EmployeesPageVM())
  const location = useLocation()
  useEffect(()=>{
    control.initiate(Number(new URLSearchParams(location?.search).get('page')??1))
  },[])
  return (
                  
    <div className='d-flex flex-column justify-content-between' style={{ minHeight:'100%' }}>
    <div className='d-flex flex-column justify-content-between'>
      <Row className='py-5'>
        <Row className='p-0'>
          <div className='d-flex justify-content-start py-3'>
            <button className='button-I btn-clr-II px-sm-5 px-2 fs-5' onClick={()=>navigator.CreateEmployee()}>اضافة موظف جديد</button>
          </div>
        </Row>
        {
            control.ShowWithMessege(
              control.Data && control.Data.data?(control.Data?.data.map((item,index)=>(
              <Col key={index} className='p-2 h-auto' lg={6}>
                <EmployeeCard 
                  data={item} 
                  list={control}
                  vm={control}
                  />
              </Col>
            ))):null)
          
        }

      </Row>

    </div>
        <div>
        <Pagination pagesCount={control.Data?.pagination.total_pages||0} initial={0} onPageChange={(page)=>{ control.getPage(Number(page),false) }  }/>
      </div>  
      </div>
  )
}

class EmployeesPageVM extends PaginatedListVM<UserProfile>{
  
  private _specializationsList : specialization[] = [];
  public get specializationsList() : specialization[] {
    return this._specializationsList;
  }
  public set specializationsList(v : specialization[]) {
    this._specializationsList = v;
  }

  
  private _rolesList : Role[] = [];
  public get rolesList() : Role[] {
    return this._rolesList;
  }
  public set rolesList(v : Role[]) {
    this._rolesList = v;
  }
  
  
  constructor(){
    super(EmployeeClient,false)
    this.messege= 'لا يوجد بيانات'
  }
  public initiate(page?:number): void {
    const fn = async()=>{
      await this.getSpecializations()
      await this.getRoles()
      this.getPage(page, false )
    }
    fn()
  }
  private async getSpecializations(){
    const response = await new SpecializationClient().getAll()
    if(response){
      this._specializationsList = response
    }
  }
  private async getRoles(){
    const response = await new RoleClient().getAll()
    if(response){
      this._rolesList = response
    }
  }
}


const EmployeeCard = (props:{data:UserProfile, list:EmployeesPageVM , vm?:EmployeesPageVM})=>{
  const control = useVM<EmployeeCardVM>(new EmployeeCardVM(props.list))
  useEffect(()=>{control.fill(props.data)},[])
  return (
    <div className=' border rounded-2 h-100'>
      {
        control.Show(
          <Row className='py-2 h-100'>
          <Col sm={4} className='' onClick={()=>navigator.CreateEmployee(control.Data?.id)}>
            <CustomImageUpload value={control.Data?.img??''} onSelect={a=>control.Img=a} editableMode={control.Editing} secVm={control } ratio="1x1"/>
          </Col>
          <Col className='d-flex flex-column justify-content-between text-start' sm={8}>
            <div>
              <div >
                {
                  <div className='d-flex justify-content-between p-1'>
                    <div className='d-flex'>
                      <h6 className='my-auto p-1 fw-bold' onClick={()=>navigator.CreateEmployee(control.Data?.id)}>{control.Data?.user_admin?.emp_key}</h6>
                      <h6 className='my-auto' onClick={()=>navigator.CreateEmployee(control.Data?.id)}>{control.Data?.name}</h6>
                    </div>
                    <div className='d-flex'>
                      <span className='material-symbols-outlined btn-clr-save p-1 c-pointer' onClick={()=>navigator.CreateEmployee(control.Data?.id)}>edit</span>
                      <span className='material-symbols-outlined btn-delete p-1 c-pointer' onClick={()=>{
                        Globals.popup.open({
                          content:
                          <div className='d-flex flex-column justify-content-between h-100'>
                            <div className='d-flex flex-column justify-content-center h-w-100'>
                              <div>
                                هل تريد حذف الموظف
                              </div> 
                              <div>{control.Data?.user_admin?.emp_key} {control.Data?.name} ؟</div>
                              <div>
                                ملاحظة : فى حالة حذف الموظف لا يمكن استرجاع معلوماته    
                              </div>
                            </div>
                            <div className='d-flex justify-content-center '>
                              <div className='button-I btn-clr-II px-3 py-1 c-pointer' onClick={()=>{ Globals.popup.close()  ;control.delete() }}>موافق</div>
                            </div>
                          </div>
                        })
                      }}>delete</span>
                    </div>
                  </div>
                }
              </div>
              <div className='d-flex' onClick={()=>navigator.CreateEmployee(control.Data?.id)}>
                {
                  control.Editing?(
                    <div className='d-flex justify-content-between  p-1'>
                      <CustomSelect 
                        list={props.list.specializationsList.map(a=>({label:a.specialization , value:a.id??''}))}
                        selected={control.Data?.specialization?.id}
                        onSelect={a=>control.setSpecialization(a)}
                      />
                    </div>
                  ):(
                    <div className='d-flex justify-content-between p-1'>
                      <h6 className='my-auto'>{control.Data?.specialization?.specialization}</h6>
                    </div>
                  )
                }
                {
                  control.Editing?(
                    <div className='d-flex justify-content-between  p-1'>
                      <CustomSelect 
                        list={props.list.rolesList.map(a=>({label:a.role , value:a.id??''}))}
                        selected={control.Data?.role?.id}
                        onSelect={a=>control.setRole(a)}
                      />
                    </div>
                  ):(
                    <div className='d-flex justify-content-between p-1'>
                      <h6 className='my-auto'>{control.Data?.role?.role}</h6>
                    </div>
                  )
                }
              </div>
              <div>
                {
                  control.Editing?(
                    <div className='d-flex justify-content-between  p-1'>
                      <textarea className='input-field my-auto' style={{ minWidth:'0' }} value={control.Data?.description} onChange={a=>control.Description=a.target.value} placeholder="الوصف"/>
                    </div>
                  ):(
                    <div className='d-flex justify-content-between p-1'>
                      <h6 className='my-auto'>{control.Data?.description}</h6>
                    </div>
                  )
                }
              </div>
            </div>
            <div className='d-flex' onClick={()=>navigator.CreateEmployee(control.Data?.id)}>
              {
                control.Editing?(
                  <div className='d-flex justify-content-between  p-1'>
                    <input className='input-field w-100' style={{ minWidth:'0' }} value={control.Data?.email} onChange={a=>control.Email=a.target.value} placeholder="الايميل"/>
                  </div>
                ):(
                  <div className='d-flex justify-content-between p-1'>
                    <h6 className='my-auto'>{control.Data?.email}</h6>
                  </div>
                )
              }
              {
                control.Editing?(
                  <div className='d-flex justify-content-between my-auto p-1'>
                    <CustomPhoneInput className='input-field w-100 my-auto' 
                      setFullNumber={a=>control.Mobile=a}
                      value={control.Data?.mobile}
                    />
                  </div>
                ):(
                  <div className='d-flex justify-content-between p-1'>
                    <h6 className='my-auto'>{control.Data?.mobile}</h6>
                  </div>
                )
              }
            </div>
            <div className='d-flex' onClick={()=>navigator.CreateEmployee(control.Data?.id)}>
              {
                control.Editing?(
                  <div className='d-flex justify-content-between  p-1'>
                    <CustomSelect 
                      list={[{value:'1' , label:'ذكر'}, {value:'0' , label:'انثى'}]}
                      selected={control.Data?.is_male?.toString()}
                      onSelect={a=>control.IsMale = a}
                    />
                  </div>
                ):(
                  <div className='d-flex justify-content-between p-1'>
                    <h6 className='my-auto'>{control.Data?.role?.role}</h6>
                  </div>
                )
              }
            </div>
          </Col>
        </Row>
        )
      }

    </div>
  )
}

class EmployeeCardVM extends EditableItemVM<UserProfile>{
  public set Name(v:string){ if(this.data)this.data.name =v; this.update()  }
  public set Email(v:string){ if(this.data)this.data.email =v; this.update()  }
  public set Mobile(v:string){ if(this.data)this.data.mobile =v; this.update()  }
  public set Img(v:File|string){ if(this.data)this.data.img =v; this.update()  }
  public set IsMale(v:string){ if(this.data)this.data.is_male =v; this.update()  }
  public set Description(v:string){ if(this.data)this.data.description =v; this.update()  }

  private _specializations : specialization[]=[];
  public get specializations() : specialization[] {
    return this._specializations;
  }
  public set specializations(v : specialization[]) {
    this._specializations = v;
    this.update()
  }

  
  private _list : EmployeesPageVM;
  public get list() : EmployeesPageVM {
    return this._list;
  }
  public set list(v : EmployeesPageVM) {
    this._list = v;
    this.update()
  }
  
  private _roles : Role[]=[];
  public get roles() : Role[] {
    return this._roles;
  }
  public set roles(v : Role[]) {
    this._roles = v;
  }
  
  
  constructor(vm:EmployeesPageVM){
    super(EmployeeClient)
    this._list = vm
    this.editing = false
  }

  public setRole(id:string){
    if(this.data){
      let value = this._list.rolesList.find(a=>a.id===id)?.role
      if(value){
        this.data.role_id = id
        this.data.role = {id:id , role:value}
      }
      this.update()
    }
  }
  public setSpecialization(id:string){
    if(this.data){ 
      let value = this._list.specializationsList.find(a=>a.id==id)?.specialization
      if(value){
        this.data.specialization_id =  id
        this.data.specialization = {id:id , specialization:value}
      }
      this.update()
    }
  }

  public onSave(): void {

    this.loading(async()=>{
      if(this.data){
        const response = await new this.clientType().insert(this.data)
        if(response){
          this.data = response
          this.initialData = response
        }else {
          this.data = this.initialData
        }
        this.update()
      }
    })
  }

  public onCancel(): void {
    this.loading(async()=>{
      if(this.initialData)this.data = {...this.initialData}
      this.update()
    })
  }

  public onDelete(page?:number): void {
    this._list.loading(async()=>{
      if(this.data && this.data.user_admin_id){
        const response = await new UserAdminClient().delete(this.data.user_admin_id)
        if(response){
            const respons = await new this._list.clientType().getPage(page??1,false)
            if(respons){
                this._list.Data = respons
            }
        }else {
          this.data = this.initialData
        }
        this.update()
      }
    })
  }
}



