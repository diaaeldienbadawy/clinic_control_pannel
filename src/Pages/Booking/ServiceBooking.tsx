import React, { FC, useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { json } from 'stream/consumers'
import { EditablePageVM } from '../../MyLib/Structure/ViewModels/Abstracts/EditablePageVM'
import { booking } from '../../Structure/Models/booking'
import { InterActive, useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { branch } from '../../Structure/Models/branch'
import CustomSelect from '../../MyLib/Components/CustomSelect'
import { BranchClient } from '../../Structure/Api/Clients/BranchClient'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { DateTime } from '../../MyLib/Structure/Handlers/functions'
import { BookingClient } from '../../Structure/Api/Clients/BookingClient'
import { Notify } from '../../MyLib/Structure/Handlers/Notifications'
import { BookingsPageVM } from './BookingsPage'
import { serviceBooking } from '../../Structure/Models/serviceBooking'
import { ServiceClient } from '../../Structure/Api/Clients/ServiceClient'
import { service } from '../../Structure/Models/service'
import { UserProfile } from '../../Structure/Models/User'
import { ServiceBookingClient } from '../../Structure/Api/Clients/ServiceBookingClient'
import { ServiceBookingsPageVM } from './ServiceBookingsPage'
import CustomPhoneInput from '../../MyLib/Components/CustomPhoneInput'
import { BookingsPageHistoryVM } from './BookingsPageHistory'
import { ServiceBookingsPageHistoryVM } from './ServiceBookingsPageHistory'

export const ServiceBooking:FC<{vm:BookingsPageVM|BookingsPageHistoryVM|ServiceBookingsPageVM|ServiceBookingsPageHistoryVM,booking?:booking}> = ({vm,booking})  => {
    
  const control = useVM<ServiceBookingVM>(new ServiceBookingVM())

  useEffect(()=>control.initiate(booking),[])

  const [additional, setAdditional] = useState('')
  const [discount, setDiscount] = useState('')
  const [paid, setPaid] = useState('0')

  const [hasPaid, setHasPaid] = useState(false)
    
  useEffect(()=>{
    let total = Number(additional)-Number(discount)
    if(control.data.price) total = Number(total) + Number(control.data.price)
      setPaid(Math.max(total,0).toString())
      

  },[discount,additional,control.data.price])
  
  useEffect(()=>{
    control.data.status = hasPaid?'paid':'pending'
    if(hasPaid){
        control.data.additional= Number(additional)
        control.data.discount=Number(discount)
        control.data.paid = Number(paid)
    }
    else{
        control.data.additional = 0
        control.data.discount = 0
        control.data.paid = 0
    }
  },[hasPaid])

  const [id, setid] = useState(Math.floor(Math.random()*100))

  return (
    <Container>
        <Row id='booking' className='py-2 justify-content-center w-100'>
            <Col md={12} className='px-lg-2'>
            {control.Show(
                <div className='py-2 rounded-5'>
                    <h3 className='fw-bold py-1 text-center'>حجز موعد</h3>
                    <div className='py-1'>
                        <Row className='py-2 border rounded-3' style={{ zIndex:2000 }}>
                            <Col className=' py-3 py-xl-3 px-md-5' xl={4}>
                                <Row className='d-flex justify-content-center w-100 py-2'>
                                    <Col sm={9}>
                                        <input className='w-100 input-field fw-bold text-color-primary-II' type="text" placeholder='الاسم' value={control.data.name} onChange={a=>control.Name=a.target.value}/>
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center w-100 py-2'>
                                    <Col sm={9}>
                                        <CustomPhoneInput placeholder='موبايل' className='w-100 input-field  text-input fw-bold text-color-primary-II' value={control.data.mobile} setFullNumber={a=>control.Mobile=a} />
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center w-100 py-2'>
                                    <Col sm={9}>
                                        <CustomPhoneInput  placeholder='واتساب' className='w-100 input-field  text-input fw-bold text-color-primary-II' value={control.data.whatsapp} setFullNumber={a=>control.Whatsapp=a} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col className=' pt-3 py-xl-3 px-md-5' xl={4}>
                                <Row className='d-flex justify-content-center w-100 py-2'>
                                    <Col sm={9}>
                                        <CustomSelect
                                             list={control.services?.map(a=>({label:a.title , value:a.id as string}))} 
                                             onSelect={a=>control.service=control.services.find(b=>b.id==a)} 
                                             selected={control.service?.id} 
                                             placeHolder='الخدمة...' />
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center w-100 py-2'>
                                    <Col sm={9}>
                                          <CustomSelect 
                                            list={control.service?.branch_employees?.map(a=>({label:a.branch_employee?.employee?.name??'' , value:a.branch_employee?.employee?.id??''}))??[]}
                                            selected={control.doctor?.id}
                                            placeHolder='الطبيب...'
                                            onSelect={a=>{
                                                control.doctor = control.service?.branch_employees?.find(b=>b.branch_employee?.employee_id==a)?.branch_employee?.employee
                                            }}
                                            clearable
                                        /> 
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center w-100'>
                                    <Col sm={9} className=' pb-2 py-sm-2'>
                                         <CustomSelect
                                            list={control.service?.branch_employees?.filter(a=>a.branch_employee?.employee_id==control.doctor?.id).map((b)=>({label:b.branch_employee?.branch?.name??'', value:b.branch_employee?.branch?.id??''}))??[]}
                                            placeHolder='الفرع...'
                                            selected={control.branch?.id}
                                            onSelect={a=>control.branch=control.list.find(b=>b.id==a)}
                                        /> 
                                    </Col>
                                </Row>
                            </Col>
                            <Col className=' pb-3 py-xl-3 px-md-5' xl={4}>
                                {/* <Row className='d-flex justify-content-center w-100 py-2'>
                                    <Col sm={9}>
                                         <CustomSelect
                                            list={control.dates?.map(a=>({label:a , value:a}))??[]}
                                            placeHolder='التاريخ...'
                                            selected={control.data.date}
                                            onSelect={a=>control.Date=a}
                                        />  
                                    </Col>
                                </Row>
                                <Row className='d-flex justify-content-center w-100 py-2'>
                                    <Col sm={9}>
                                         <CustomSelect
                                            list={[{label:'كشف عادي' , value:'normal'},{label:'كشف مستعجل' , value:'urgent'}, {label:'استشارة' , value:'follow up'}]}
                                            placeHolder='نوع الحجز...'
                                            selected={control.data.type}
                                            onSelect={a=>control.Type=a as 'normal'|'urgent'|'follow up'}
                                        />  
                                    </Col>
                                </Row> */}
                                <Row className='d-flex justify-content-center w-100 py-2'>
                                    <Col className='d-flex' sm={6}>
                                        <div className='my-auto fs-4 justify-content-center text-center text-danger fw-bold w-100'>
                                            {
                                                control.data.price?(control.data.price==0?'مجانا':control.data.price):''
                                            } 
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    {
                        control.data.price!=undefined?(
                        <div className=' py-2'>
                            <Row className='border rounded-3' style={{ zIndex:2000 }}>
                                <Col className=' py-3 py-xl-3 px-md-5 d-flex' xl={3} md={6}>
                                    <div className='row py-2  my-auto w-100'>
                                      <div className='col-sm-6 col-12 d-flex' >
                                        <div className='my-auto'>مدفوعات اضافية</div>
                                      </div>
                                      <div className='col-sm-6 col-12 d-flex'>
                                        <div className='my-auto'>
                                          <input type="text" className='input-field w-100' value={additional} onChange={a=>setAdditional((a.target.value.replace(/[^0-9]/g, '')))} />
                                        </div>
                                      </div>
                                    </div>
                                </Col>
                                <Col className=' pt-3 py-xl-3 px-md-5 d-flex' xl={3} md={6}>
                                    <div className='row py-2 my-auto w-100'>
                                      <div className='col-sm-6 col-12 d-flex' >
                                        <div className='my-auto'>خصم</div>
                                      </div>
                                      <div className='col-sm-6 col-12 d-flex'>
                                        <div className='my-auto'>
                                          <input type="text" className='input-field w-100' value={discount} onChange={a=>setDiscount((a.target.value.replace(/[^0-9]/g, '')))} />
                                        </div>
                                      </div>
                                    </div>
                                </Col>
                                <Col className=' pb-3 py-xl-3 px-md-5 d-flex' xl={3} md={6}>
                                    <div className='row py-2  my-auto w-100'>
                                      <div className='col-sm-6 col-12 d-flex' >
                                        <div className='my-auto'>القيمة المطلوبة</div>
                                      </div>
                                      <div className='col-sm-6 col-12 d-flex '>
                                        <div className='my-auto w-100'>
                                          {paid}
                                        </div>
                                      </div>
                                    </div>
                                </Col>
                                <Col className=' pb-3 py-xl-3 px-md-5 d-flex' xl={3} md={6}>
                                    <div className='row py-2  my-auto w-100'>
                                      <div className='col-sm-6 col-12 d-flex my-auto' >
                                        <div className='px-3 my-auto'> 
                                            <input id={id.toString()} type="checkbox" className='input-field' onChange={a=>setHasPaid(a.target.checked)}  />
                                        </div>
                                        <div className='my-auto'>
                                            <label htmlFor={id.toString()}> تم الدفع </label>
                                        </div>
                                      </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        ):(null)
                    }
                    <div className='d-flex justify-content-center py-1'>
                        <div className='button-I btn-clr-I px-5 py-1' onClick={()=>control.send(vm)}>
                            احجز الأن
                        </div>
                    </div>
                </div>)}
            </Col>
        </Row>
    </Container>
  )
}

export class ServiceBookingVM extends InterActive{
    private _list : branch[] = [];
    public get list() : branch[] {
        return this._list;
    }
    public set list(v : branch[]) {
        this._list = v;
        this.update()
    }
    
    private _services : service[] = [];
    public get services() : service[]  {
        return this._services;
    }
    public set services(v : service[] ) {
        this._services = v;
        this.update()
    }
     
    private _data : serviceBooking = {id:undefined , mobile:'' , whatsapp:'' , name:'' , service_name:'' , status:'pending' , booking_number:0 , is_done:0 , price:0 , additional:0 , discount:0 ,paid:0 };
    public get data() : serviceBooking {
        return this._data;
    }
    public set data(v : serviceBooking) {
        this._data = v;
        this.update()
    }
    
    private _service : service|undefined;
    public get service() : service|undefined {
        return this._service;
    }
    public set service(v : service|undefined) {
        this._service = v;
        this._data.service_id = v?.id
        this._data.service_name = v?.title??''
        this._data.price = v?.price
        this.update()
    }
    
    
    private _doctor : UserProfile|undefined;
    public get doctor() :  UserProfile|undefined {
        return this._doctor;
    }
    public set doctor(v :  UserProfile|undefined) {
        this.loading(async()=>{
            this._doctor = v; 
            this.updatePrice();
            this.update()
        })

    }

    private _branch : branch|undefined ;
    public get branch() : branch|undefined {
        return this._branch;
    }
    public set branch(v : branch|undefined) {
        this.loading(async()=>{
            this._branch = v;
            //this.doctor = undefined;
            this.updatePrice()
            this.update()
        })

    }

    public set Name(v:string){ this._data.name = v  ; this.update()}
    public set Whatsapp(v:string){ this._data.whatsapp = v; this.update() }
    public set Mobile(v:string){ this._data.mobile = v; this.update() }


    public initiate(booking?:booking){

        this.loading(async()=>{
            this._data.name = booking?.name??''
            this._data.mobile = booking?.mobile??''
            this._data.whatsapp = booking?.email??''
            let branchs = await new BranchClient().getAll()
            if(branchs){
                this._list = branchs
            } 
            let response = await new ServiceClient().getAll()
            if(response){
                this._services = response
            }
            this.update()
        })

    }

    public updatePrice(){
        if(this._branch && this._doctor){
            let selected = this._service?.branch_employees?.find(a=>(a.branch_employee?.branch_id==this._branch?.id && a.branch_employee?.employee_id==this._doctor?.id))

            this._data.branch_employee_service = selected
            this._data.branch_employee_service_id = selected?.id
        }
    }
    public getDates(dayShort:string):string[]{
        const daysMap: { [key: string]: number } = {
            Sun: 0,
            Mon: 1,
            Tue: 2,
            Wed: 3,
            Thu: 4,
            Fri: 5,
            Sat: 6,
          };
        
          if (!daysMap.hasOwnProperty(dayShort)) {
            return []
          }
        
          const targetDay = daysMap[dayShort];
          const today = new Date();
          const result: string[] = [];
          let count = 0;
        
          while (result.length < 4) {
            const nextDate = new Date();
            nextDate.setDate(today.getDate() + count);
            if (nextDate.getDay() === targetDay) {
              result.push(nextDate.toISOString().split("T")[0]); // صيغة YYYY-MM-DD
            }
            count++;
          }
        
          return result;
    }

    public send(vm?:BookingsPageVM|BookingsPageHistoryVM|ServiceBookingsPageVM|ServiceBookingsPageHistoryVM){
        this.loading(async()=>{
            if(this.validate()){
                let response = await new ServiceBookingClient().insert(this.data)
                if(response){
                    Notify({title:'عملية ناجحة' , type:'success' , body:'تم الحجز بنجاح'})
                    Globals.popup.close()
                    if(vm)vm.getPage()
                }
                this._service = undefined
                this._doctor = undefined
                this._branch = undefined
                this._data = {id:undefined , mobile:'' , whatsapp:'' , name:'' , service_name:'' , status:'pending' , booking_number:0 , is_done:0 };
            }
            this.update()
        })
    }

    public validate():boolean{
        if(!this.data.name){ Notify({title:'خطأ فى البيانات' , type:'danger' , body:'يجب ادخال الاسم'}) ; return false }
        if(!this.data.mobile){ Notify({title:'خطأ فى البيانات' , type:'danger' , body:'يجب ادخال الموبايل'}) ; return false }
        if(!this.data.service_id){ Notify({title:'خطأ فى البيانات' , type:'danger' , body:'يجب اختيار الفرع و الطبيب و الموعد'}) ; return false }
        if(!this.data.branch_employee_service_id){ Notify({title:'خطأ فى البيانات' , type:'danger' , body:'يجب اختيار الفرع و الطبيب و الموعد'}) ; return false }
        return true
    }
}
