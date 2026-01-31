import React, { useEffect, useState } from 'react'
import { InterActive, useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { AxiosClientRepository } from '../../MyLib/Structure/Handlers/AxiosClient'
import { User, UserProfile } from '../../Structure/Models/User'
import { Col, Row } from 'react-bootstrap'
import Control from 'react-select/dist/declarations/src/components/Control'
import { UserAdminClient } from '../../Structure/Api/Clients/UserAdminClient'
import { Role } from '../../Structure/Models/Role'
import { specialization } from '../../Structure/Models/Specialization'
import { SpecializationClient } from '../../Structure/Api/Clients/SpecializationClient'
import { RoleClient } from '../../Structure/Api/Clients/RoleClient'
import CustomPhoneInput from '../../MyLib/Components/CustomPhoneInput'
import CustomSelect from '../../MyLib/Components/CustomSelect'
import { EmployeeClient } from '../../Structure/Api/Clients/EmployeeClient'
import { navigator } from '../../MyLib/Components/Facilities'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import { EditablePageVM } from '../../MyLib/Structure/ViewModels/Abstracts/EditablePageVM'
import { certificate } from '../../Structure/Models/certificate'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { send } from 'process'
import { Notify } from '../../MyLib/Structure/Handlers/Notifications'
import { GeneralMethods } from '../../MyLib/Structure/Handlers/GeneralMethods'

const CreateEmployee = () => {
    const control = useVM<CreateEmployeeVM>(new CreateEmployeeVM())
    useEffect(()=>{control.initiate()},[])

    const NewCeritificate = ()=>{
        const [title, setTitle] = useState(control.newCertificate.title)
        const [img, setImg] = useState(control.newCertificate.certificate_img)
        const [discription, setDiscription] = useState(control.newCertificate.discription)

        const add = ()=>{
            control.newCertificate = {
                title:title,
                certificate_img:img,
                discription:discription
            }
            control.addCertificate()
            Globals.popup.close()
        }
        return (                                      
        <Row>
            <Col lg={6}>
                <div className='py-1'>
                    <input type="text" className='input-field w-100' value={title} onChange={(a)=>setTitle(a.target.value)} />
                </div>
                <div className='py-1'>
                    <textarea className='input-field w-100' value={discription} onChange={a=>setDiscription(a.target.value)}></textarea>
                </div>
            </Col>
            <Col lg={6}>
                <CustomImageUpload value={img}  onSelect={a=>setImg(a)} ratio='16x9'/>
            </Col>
            <div className='d-flex justify-content-center py-2'>
                <button className='button-I btn-clr-II px-5 py-1' onClick={()=>add()}>اضافة</button>
            </div>
        </Row>
        )
    }


  return (
    <div className='h-100'>
        {
            control.Show(
                <div className='text-center h-100'>
                    <h4 className='py-5'>
                        انشاء موظف جديد
                    </h4>
                    <Row className='justify-content-center py-2'>
                        <Col className='border rounded-2 px-md-5 px-0 py-4' md={6}>
                            <Row>
                                <Col xl={6}>
                                    <label className='py-2' htmlFor="">
                                        كلمة السر
                                    </label>
                                </Col>
                                <Col xl={6}>
                                    <div className='d-flex justify-content-center my-auto'>
                                        <input type="password" className='input-field w-100' value={control.userData.password} onChange={a=>control.Password=a.target.value} />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xl={6}>
                                    <label className='py-2' htmlFor="">
                                        نوع الحساب
                                    </label>
                                </Col>
                                <Col xl={6}>
                                    <div className='d-flex justify-content-center my-auto'>
                                        <CustomSelect  
                                            list={[{label:'ادارة'  , value:'1'} , {label:'عادي' , value:'0'}]}
                                            onSelect={a=>control.Admin=a}
                                            clearable = {false}
                                            selected={control.userData.admin=="1"?'1':'0'}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='justify-content-center px-0 py-2 '>
                        <Col className=' border rounded-2 px-md-5 px-0 py-4' md={6}>
                            <Row className='py-1 pb-3'>
                                <div className='fs-5'>
                                    الرقم الوظيفي : 
                                    {control.userData.emp_key}
                                </div>
                            </Row>
                            <Row className='py-1'>
                                <Col xl={6}>
                                    <label className='py-2' htmlFor="">
                                        الصورة الشخصية
                                    </label>
                                </Col>
                                <Col xl={6}>
                                    <div className='py-2'>
                                        <CustomImageUpload
                                            ratio="16x9"
                                            onSelect={a=>control.Img=a}
                                            value={control.data.img}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='py-1'>
                                <Col xl={6}>
                                    <label className='py-2' htmlFor="">
                                        الاسم
                                    </label>
                                </Col>
                                <Col xl={6}>
                                    <div className='d-flex justify-content-center my-auto'>
                                        <input type="text" 
                                            className='input-field w-100'  
                                            value={control.data.name} 
                                            onChange={a=>control.Name=a.target.value} />
                                    </div>
                                </Col>
                            </Row>
                            <Row className='py-1'>
                                <Col xl={6}>
                                    <label className='py-2' htmlFor="">
                                        الايميل
                                    </label>
                                </Col>
                                <Col xl={6}>
                                    <div className='d-flex justify-content-center my-auto '>
                                        <input type="text" 
                                            className='input-field w-100' 
                                            value={control.data.email} 
                                            onChange={a=>control.Email=a.target.value} />
                                    </div>
                                </Col>
                            </Row>
                             <Row className='py-1'>
                                <Col xl={6}>
                                    <label className='py-2' htmlFor="">
                                        الموبايل
                                    </label>
                                </Col>
                                <Col xl={6}>
                                    <div className='d-flex justify-content-center my-auto'>
                                        <input
                                            className='input-field'
                                            value={control.data.mobile}
                                            onChange={a=>control.Mobile = GeneralMethods.mobileNumberInput(a.target.value) }
                                        />
                                    </div>
                                </Col>
                            </Row> 
                            <Row className='py-1'>
                                <Col xl={6}>
                                    <label className='py-2' htmlFor="">
                                        الوظيفة
                                    </label>
                                </Col>
                                <Col xl={6}>
                                    <div className='d-flex justify-content-center my-auto'>
                                        <CustomSelect
                                            list={control.roles.map(a=>({label:a.role , value:a.id??''}))}
                                            onSelect={a=>control.setRole(a)}
                                            selected={control.data.role_id??''}
                                            clearable={false}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            {
                                control.data.role_id=='1'?(
                                <Row className='py-1'>
                                    <Col xl={6}>
                                        <label className='py-2' htmlFor="">
                                            التخصص
                                        </label>
                                    </Col>
                                    <Col xl={6}>
                                        <div className='d-flex justify-content-center my-auto'>
                                            <CustomSelect
                                                list={control.specializations.map(a=>({label:a.specialization , value:a.id??''}))}
                                                onSelect={a=>control.setSpecialization(a)}
                                                selected={control.data.specialization_id??''}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                ):null
                            }
                            
                             <Row className='py-1'>
                                <Col xl={6}>
                                    <label className='py-2' htmlFor="">
                                        النوع
                                    </label>
                                </Col>
                                <Col xl={6}>
                                    <div className='d-flex justify-content-center my-auto'>
                                        <CustomSelect
                                            list={[{label:'ذكر' , value:'1'} , {label:'انثى', value:'0'}]}
                                            selected={control.data.is_male=="1"?'1':'0'}
                                            onSelect={a=>control.IsMale=a}
                                            clearable={false}
                                        />
                                    </div>
                                </Col>
                            </Row> 
                            <Row className='py-1'>
                                <Col xl={6}>

                                </Col>
                                <Col xl={6}>
                                    <div className='d-flex justify-content-center my-auto'>
                                        <input 
                                            id='isVisible'
                                            type="checkbox" className='' 
                                            style={{ scale:'1.2' }} 
                                            checked={control.data.is_visible=="1"?true:false}
                                            onChange={a=>control.IsVisible=a.target.checked?'1':'0'}    
                                        />
                                        <label className='p-2' htmlFor="isVisible">
                                            اظهار
                                        </label>
                                    </div>
                                </Col>
                            </Row> 
                             <Row>
                                <Col xl={6}>
                                    <label className='py-2' htmlFor="">
                                        نبذة
                                    </label>
                                </Col>
                                <Col xl={6}>
                                <div className='d-flex justify-content-center my-auto'>
                                        <textarea
                                            className='input-field w-100' 
                                            value={control.data.description} 
                                            onChange={a=>control.Description=a.target.value} />
                                    </div>
                                </Col>
                            </Row> 
                        </Col>
                    </Row>
                     <Row className='justify-content-center py-2 '>

                        <Col className=' border rounded-2 px-md-5 px-0 py-4' md={6}>
                        <h5 className='fw-bold'>الشهادات</h5>
                        {
                            control.data.certificates?.map((item,index)=>(
                            <Row className='py-2 flex-md-row-reverse'>
                                <Col lg={6}>
                                    <CustomImageUpload editableMode={false} value={item.certificate_img}  onSelect={a=>{}} ratio='16x9'/>
                                </Col>
                                <Col lg={6}>
                                    <div className='d-flex justify-content-md-start justify-content-end w-100'>
                                        <div className='material-symbols-outlined c-pointer btn-delete' onClick={()=>{
                                            Globals.popup.open({
                                                content:
                                                    <div className='d-flex flex-column h-100'>
                                                        <div className='d-flex flex-column h-100 justify-content-center'>
                                                            هل تريد حذف الشهاده ؟   
                                                        </div>
                                                        <div className='d-flex justify-content-center'>
                                                            <div className='button-I btn-clr-II px-3 py-1 c-pointer'
                                                                onClick={()=>{control.removeCertificate(item); Globals.popup.close()}}
                                                            >موافق</div>
                                                        </div>
                                                  </div>
                                            })
                                        }}>delete</div>
                                    </div>
                                    <div className='py-1'>
                                        {item.title} 
                                    </div>
                                    <div className='py-1'>
                                        {item.discription}
                                    </div>
                                </Col>

                            </Row>
                            ))
                        }
                            <Row className='py-2'>
                                <div className='d-flex color-III c-pointer'
                                  onClick={()=>{
                                    Globals.popup.open({
                                      content:<NewCeritificate/>

                                    })
                                  }}
                                >
                                  <div className='px-1 my-auto fs-4 fw-bold'>+</div>
                                  <div className='px-1 my-auto fs-5'>اضافة شهادة</div>
                                </div>
                                
                            </Row>
                        </Col>
                    </Row> 
                    <div className='py-5'>
                        <button className=' button-I btn-clr-II px-5 py-1' onClick={()=>control.save()}>تسجيل</button>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default CreateEmployee


export class CreateEmployeeVM extends EditablePageVM<UserProfile>{
    
    
    private _userData : User = { admin : '0' };
    public get userData() : User {
        return this._userData;
    }
    
    
    private _newCertificate : certificate= {id:undefined, employee_id:undefined , title:'', discription:undefined , certificate_img:''};
    public get newCertificate() : certificate {
        return this._newCertificate;
    }
    public set newCertificate(v : certificate) {
        this._newCertificate = v;
        this.update()
    }
    

    private _roles : Role[] = [];
    public get roles() : Role[] {
        return this._roles;
    }
    public set roles(v : Role[]) {
        this._roles = v;
        this.update()
    }
    
    
    private _specializations : specialization[] = [];
    public get specializations() : specialization[] {
        return this._specializations;
    }
    public set specializations(v : specialization[]) {
        this._specializations = v;
        this.update()
    }
    
    public set Password(v:string){ this.userData.password = v; this.update() }
    public set Admin(v:string){ this.userData.admin = v; this.update() }

    public set Name(v:string){ this.data.name = v; this.update() }
    public set Email(v:string){ this.data.email = v; this.update() }
    public set Mobile(v:string){ this.data.mobile = v; this.update() }
    public set Img(v:File|string){ if(this.data)this.data.img =v; this.update()  }
    public set IsMale(v:string){ if(this.data)this.data.is_male =v; this.update()  }
    public set Description(v:string){ if(this.data)this.data.description =v; this.update()  }
    public set IsVisible(v:string){ if(this.data)this.data.is_visible =v; this.update()  }

    public set NewCertificateTitle(v:string){ this._newCertificate.title = v; this.update() }
    public set NewCertificateDiscription(v:string) { this._newCertificate.discription = v; this.update() }
    public set NewCertificateImg(v:File|string) { this._newCertificate.certificate_img = v; this.update() }

    public async preInitiate(): Promise<void> {
        this.specializations  = await new SpecializationClient().getAll()??[]
        this.roles = await new RoleClient().getAll()??[]
        
    }

    public async afterInitiate(): Promise<void> {
        if(this.data.user_admin_id){
            let response = await new UserAdminClient().find(this.data?.user_admin_id)
            if(response){
                this._userData = response
            }
        }
    }

  constructor(){
      let init:UserProfile = {name:'' , img:'' ,  is_male:'1', is_visible:'1'}
      super(init ,EmployeeClient)
  }


    public save(){
        this.loading(async()=>{
            if(this.validate()){
                const auth = await new UserAdminClient().insert(this.userData)
                if(auth){
                    this._userData = auth
                    this.data.user_admin_id = auth.id
                    this.data.user_admin = auth
                    const profile = await new EmployeeClient().insert(this.data)
                    if(profile){
                        navigator.Employees()
                    }
                }
            }
        })
    }

    public setRole(id:string){
        if(this.data){
          let value = this.roles.find(a=>a.id==id)?.role
          if(value){
            this.data.role_id = id
            this.data.role = {id:id , role:value}
            if(id=='1'){
                this.data.specialization_id = undefined
                this.data.specialization = undefined
            }
          }
          this.update()
        }
      }
      public setSpecialization(id:string){
        if(this.data){ 
          let value = this.specializations.find(a=>a.id==id)?.specialization
          if(value){
            this.data.specialization_id =  id
            this.data.specialization = {id:id , specialization:value}
          }
          this.update()
        }
      }

    public addCertificate(){
        this.loading(async()=>{
            if(this._data.certificates) this._data.certificates?.push(this.newCertificate)
            else this._data.certificates = [this.newCertificate]
            this._newCertificate = {id:undefined, employee_id:undefined , title:'', discription:undefined , certificate_img:''}
            this.update()
        })
    }
    public removeCertificate(item:certificate){
        this._data.certificates  = this._data.certificates?.filter(a=>a.title!=item.title||a.discription!=item.discription||a.certificate_img!=item.certificate_img)
        if(!this._data.certificates) this._data.certificates  = []
        this.update()
    }

    public validate(){
        if(!this.data.name){ Notify({title:'خطأ' , type:'danger' , body:'يجب ادخال اسم الموظف'});return false }
        if(!this.data.role_id){ Notify({title:'خطأ' , type:'danger' , body:'يجب اختيار الوظيفة'});return false }
        return true
    }
}