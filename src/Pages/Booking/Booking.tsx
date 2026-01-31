import React, { FC, useEffect, useRef, useState } from 'react'
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
import { BookingsPageVM } from './BookingsPage'
import { Notify } from '../../MyLib/Structure/Handlers/Notifications'
import { ServiceBookingsPageVM } from './ServiceBookingsPage'
import CustomPhoneInput from '../../MyLib/Components/CustomPhoneInput'
import { GeneralMethods } from '../../MyLib/Structure/Handlers/GeneralMethods'
import { BookingsPageHistoryVM } from './BookingsPageHistory'
import { ServiceBookingsPageHistoryVM } from './ServiceBookingsPageHistory'
import MyPopup from '../../MyLib/Components/MyPopup'

export const Booking:FC<{vm:BookingsPageVM|BookingsPageHistoryVM|ServiceBookingsPageVM|ServiceBookingsPageHistoryVM}> = ({vm}) => {
    
    const control = useVM<BookingVM>(new BookingVM())
    const booking = useRef<HTMLElement>(null)    
    useEffect(()=>control.initiate(),[])
    useEffect(()=>{
      booking.current?.classList.add('show')
    },[])
  
    const doctorSelection = useRef<HTMLDivElement>(null)
    const periodSelection = useRef<HTMLDivElement>(null)
    const checkupSelection = useRef<HTMLDivElement>(null)
    const periods = control.list.find(a=>a.id==control.branch)?.employees?.find(a=>a.id==control.doctor)?.periods
  
    const getPeriod = ()=>{
      let per =control.list.find(b=>b.id==control.branch)?.employees?.find(b=>b.id==control.doctor)?.periods?.find(b=>b.id==control.data.period_id)
      return <>
      {per?
      (<div className='d-flex justify-content-around w-100'>
          {per?(<div className='text-center p-1'>{DateTime.getDayFromShort(per?.day as string)}</div>) :null}  
          {per?(<div className='text-center p-1'>{control.date?control.date.toLocaleDateString("ar-EG", { day: "numeric", month: "long" }):'sss'}</div>) :null}  
          {per?(<div className='text-center p-1'>{(per?.end_time?(' من '+GeneralMethods.formatTime(per?.start_time as string ) as string + ' الى ' + GeneralMethods.formatTime(per?.end_time as string) as string):(GeneralMethods.formatTime(per?.start_time as string)))}</div>):null}
  
      </div>):'اختر الموعد...'}
      </>
  }

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
                    <Row className='py-1'>
                        <Col className=' py-3 py-xl-3 px-md-5' xl={6}>
                            <Row>
                                <Col className='p-1' sm={6}>
                                    <div className='d-flex w-100 h-100 p-0 m-0 bg-VI'>
                                        <input className='w-100 input  text-input fw-bold text-color-primary-II  bg-II ' type="text" placeholder='الاسم' value={control.data.name} onChange={a=>control.Name=a.target.value}/>
                                    </div>
                                </Col>
                                <Col className='p-1' sm={6}>
                                    <div className='d-flex w-100 h-100 p-0 m-0 bg-VI'>
                                        <input placeholder='موبايل' maxLength={11} className='w-100 input text-input fw-bold text-color-primary-II  bg-II ' value={control.data.mobile} onChange={a=>control.Mobile=a.target.value} />
                                    </div>
                                </Col>

                                <Col className='p-1' sm={12}>
                                    <div className='d-flex w-100 h-100 p-0 m-0 bg-VI'>
                                        <input placeholder='الايميل ' className='w-100 input text-input fw-bold text-color-primary-II  bg-II ' value={control.data.email} onChange={a=>control.Email=a.target.value} />
                                    </div>
                                </Col>

                                <Col className='p-1' sm={12}>
                                    <div className='d-flex w-100 h-100 p-0 m-0 bg-VI'>
                                        <textarea placeholder='سبب الكشف (اختياري) ' style={{ resize:'none' }} className='w-100 input text-input fw-bold text-color-primary-II  bg-II ' value={control.data.reason} onChange={a=>control.Reason=a.target.value}/>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col className=' pt-3 py-xl-3 px-md-5' xl={6}>
                            <Row>
                                <Col className='p-1' sm={6}>
                                <MyPopup
                                    windowClassName={`selection-card`} 
                                    title='الفرع'
                                    label={
                                        <div className='d-flex border rounded-2 p-2 w-100 bg-II c-pointer'>
                                            <div className='material-symbols-outlined'>location_city</div>
                                            <div className='px-3 text-center w-100'>
                                                {control.branch?(control.list.find(a=>a.id==control.branch)?.name):'اختر الفرع...'}
                                            </div>
                                        </div>
                                    }
                                    content={close=>(
                                        <div className='d-flex flex-column justify-content-between h-100'>
                                            {
                                                control.list.map(branch=>(
                                                    <div className='p-2'>
                                                        <div className=' glass-effect-II rounded-2 overflow-hidden p-2 c-pointer selection-card-item' onClick={()=>{  close?.current?.click(); setTimeout(()=>{control.branch=branch.id as string; doctorSelection.current?.click(); }  , 300) }}>
                                                            {branch.name}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                />
                                </Col>
                                <Col className='p-1' sm={6}>
                                {
                                <MyPopup
                                windowClassName={`selection-card`}  
                                title='الطبيب'      
                                lableRef={doctorSelection}                            
                                label={
                                    <div className='d-flex border position-relative rounded-2 p-2 w-100 bg-II c-pointer' >
                                        <div className='material-symbols-outlined'>person </div> 
                                        <div className='px-3 text-center w-100'>
                                            {control.doctor?(control.list.find(a=>a.id==control.branch)?.employees?.find(b=>b.id==control.doctor)?.employee?.name):'اختر الطبيب...'}
                                        </div>
                                    </div>
                                }
                                content={a=>(
                                    <div className='d-flex flex-column justify-content-between h-100'>
                                        {
                                            control.list?.find(a=>a.id==control.branch)?(
                                            control.list?.find(a=>a.id==control.branch)?.employees?.filter(a=>a.employee?.role_id=="1")?.map(branchDoctor=>(
                                                <div className='p-2'>
                                                    <div className=' glass-effect-II rounded-2 overflow-hidden p-2 c-pointer selection-card-item' onClick={()=>{  a?.current?.click(); setTimeout(()=>{control.doctor=branchDoctor?.id??''; periodSelection.current?.click()} , 300) }}>
                                                        {branchDoctor.employee?.name}
                                                    </div>
                                                </div>
                                            ))):<div className='d-flex justify-content-center'>يجب اختيار الفرع اولا</div>   
                                        }
                                    </div>
                                )}
                                />  
                                }
                                </Col>
                                <Col className='p-1' sm={12}>
                                {
                                    <MyPopup
                                    windowClassName={`selection-card`}       
                                    title='الموعد' 
                                    lableRef={periodSelection}                            
                                    label={
                                        <div className='d-flex border position-relative rounded-2 p-2 w-100 bg-II c-pointer' >
                                            <div className='material-symbols-outlined my-auto'>pending_actions </div> 
                                            <div className='px-3 w-100 '>
                                                {getPeriod()}
                                            </div>
                                        </div>
                                    }
                                    content={a=>(periods?(
                                        <div className='d-flex flex-column justify-content-between h-100'>
                                            <div className='p-1'>
                                                <div className='p-1'>اليوم</div>
                                                <div className='d-flex flex-wrap'>
                                                    {periods?.map(period=>(
                                                        <div className='p-1' onClick={()=>control.day = (period.day)}>
                                                            <div className={`glass-effect-II rounded-2 overflow-hidden p-2 c-pointer selection-card-item ${period.day==control.day?'bg-I':''}`}>
                                                                {DateTime.getDayFromShort(period.day)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {
                                                control.day?(
                                                    <>
                                                        <div className='p-1'>التاريخ</div>
                                                        <div className='d-flex flex-wrap'>
                                                            {control.getDates(control.day).map((date,ind)=>(
                                                            <div className='p-1' onClick={()=>control.date = date}>
                                                                <div className={`glass-effect-II rounded-2 overflow-hidden p-2 c-pointer selection-card-item ${(control.date?(date.getDate()==control.date.getDate()):(ind==0))?'bg-I':''}`}>
                                                                    {date.toLocaleDateString("ar-EG", { day: "numeric", month: "long" })}
                                                                </div>
                                                            </div>
                                                            ))}
                                                        </div>
                                                        <div className='p-1'>الموعد</div>
                                                        <div className='d-flex flex-wrap'>
                                                            {periods?.filter(b=>b.day==control.day)?.map(period=>(
                                                                <div className='p-1' onClick={()=>{a?.current?.click();setTimeout(()=>{control.Period = period.id as string; checkupSelection.current?.click() },300)} }>
                                                                    <div className={`glass-effect-II rounded-2 overflow-hidden p-2 c-pointer selection-card-item ${period.id==control.data.period_id?'bg-I':''}`}>
                                                                        {(period.end_time?(' من '+GeneralMethods.formatTime(period.start_time as string ) as string + ' الى ' + GeneralMethods.formatTime(period.end_time as string) as string):(GeneralMethods.formatTime(period.start_time as string)))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                    ):null
                                                }
                                            </div>
                                        </div>):'يجب اختيار الطبيب اولا'
                                    )}
                                    />  
                                    }
                                </Col>
                                <Col className='p-1' sm={6}>
                                {
                                <MyPopup
                                windowClassName={`selection-card`}     
                                title='نوع الحجز'   
                                lableRef={checkupSelection}                            
                                label={
                                    <div className='d-flex border position-relative rounded-2 p-2 w-100 bg-II c-pointer' >
                                        <div className='px-3 text-center w-100'>
                                            {control.data.type=='normal'?'كشف عادي':(control.data.type=='urgent'?'كشف مستعجل':'استشارة')}
                                        </div>
                                    </div>
                                }
                                content={a=>(
                                    <div className='d-flex flex-column justify-content-between h-100'>
                                        <div className='p-2'>
                                            <div className={`glass-effect-II rounded-2 overflow-hidden p-2 c-pointer selection-card-item ${control.data.type=='normal'?'bg-I':''}`} onClick={()=>{  a?.current?.click(); setTimeout(()=>{control.Type='normal'} , 300) }}>
                                                كشف عادي
                                            </div>
                                        </div>
                                        <div className='p-2'>
                                            <div className={`glass-effect-II rounded-2 overflow-hidden p-2 c-pointer selection-card-item ${control.data.type=='urgent'?'bg-I':''}`} onClick={()=>{  a?.current?.click(); setTimeout(()=>{control.Type='urgent' } , 300) }}>
                                                كشف مستعجل
                                            </div>
                                        </div>
                                        <div className='p-2'>
                                            <div className={`glass-effect-II rounded-2 overflow-hidden p-2 c-pointer selection-card-item ${control.data.type=='follow up'?'bg-I':''}`} onClick={()=>{  a?.current?.click(); setTimeout(()=>{control.Type='follow up'} , 300) }}>
                                                استشارة
                                            </div>
                                        </div>
                                    </div>
                                )}
                                />  
                                }
                                </Col>
                                <Col className='p-1' sm={6}>
                                <div className='my-auto fs-4 justify-content-center text-center text-danger fw-bold w-100'>
                                    {
                                        control.data.price?(control.data.price==0?'مجانا':control.data.price):''
                                    } 
                                </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
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
                                            <input id={id.toString()} type="checkbox" className='input-field'  onChange={a=>setHasPaid(a.target.checked)}  />
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

export class BookingVM extends InterActive{
    private _list : branch[] = [];
    public get list() : branch[] {
        return this._list;
    }
    public set list(v : branch[]) {
        this._list = v;
        this.update()
    }
    
    
    

    
    private _data : booking = {id:undefined, period:undefined , date:'' , period_id:'' , mobile:'' , email:'' , name:'', reason:'' , type:'normal', is_done:0 };
    public get data() : booking {
        return this._data;
    }
    public set data(v : booking) {
        this._data = v;
        this.update()
    }
    
    private _doctor : string = '';
    public get doctor() : string {
        return this._doctor;
    }
    public set doctor(v : string) {
            this._doctor = v; 
            const periods = this.list.find(branch=>branch.id==this.branch)?.employees?.find(emp=>emp.id==this.doctor)?.periods
            this._data.period = periods?(periods.length>0?(periods[0]):undefined):undefined
            this._data.period_id = this._data.period?.id??''; 
            if(this.date == undefined)
                {
                    if(this._data.period)
                    this.date =this.getDates(this.day)[0]
                }
            this.updatePrice();
            this.update()
    }

    private _branch : string = '';
    public get branch() : string {
        return this._branch;
    }
    public set branch(v : string) {
        this._branch = v;
        this.doctor = '';
        this.update()
    }
    
    public set Name(v:string){ this._data.name = v.replace(/[^a-zA-ءأ-ي\s]/g, "")  ; this.update()}
    public set Email(v:string){ this._data.email = v; this.update() }
    public set Reason(v:string){ this._data.reason = v; this.update() }
    public set Mobile(v:string){ 
        v = v.replace(/[^0-9]/g, "")
        if(v.length==1 && v[0]!='0')v=''
        else if(v.length==2 && v[1]!='1')v=v[0]

        this._data.mobile = v; this.update() 
    }
    
    private _day : string = '';
    public get day() : string {
        return this._day;
    }
    public set day(v : string) {
        this._day = v;
        this.date = this.getDates(v)[0] 
        this.update()
    }
    
        
    private _date : Date|undefined;
    public get date() : Date|undefined {
        return this._date;
    }
    public set date(v : Date|undefined) {
        this._date = v;
        if(v)this.data.date = v?.toISOString().split('T')[0];
        this.update()
    }

    public set Period(v:string ){ 
        this.loading(async()=>{
            this._data.period_id = v; 
            this._data.period = this.list.find(branch=>branch.id==this.branch)?.employees?.find(emp=>emp.id==this.doctor)?.periods?.find(per=>per.id==v)
            if(this.date == undefined)this.date =this.getDates(this.day)[0]
            this.updatePrice()
            this.update() 
        })
    }

    public set Type(v:'normal'|'urgent'|'follow up'){ this._data.type = v; this.updatePrice(); this.update() }

    public initiate(){
        this.loading(async()=>{
            let response = await new BranchClient().getAll()
            if(response){
                this._list = response
                if (Array.isArray(response) && response.length === 1 && response[0]?.id){
                    this._branch = response[0].id
                    if (response?.[0]?.employees?.length === 1 && response[0].employees[0]?.id){
                        let doc = response[0].employees[0]
                        this._doctor = doc.id??''
                        if (doc?.periods?.length === 1 && doc.periods[0]?.id){
                            this.Period = doc.periods[0].id; 
                        }
                    }
                }
            } 
            this.update()
        })

    }

    public updatePrice(){
        if(this._branch && this._doctor && this._data.period){
            /*this._data.price = this._data.type == 'normal'?(this._list?.find(a=>a.id==this._branch)?.employees?.filter(a=>a.employee?.role_id=="1")?.find(a=>a.id==this._doctor)?.periods?.find(a=>a.id==this._data.period_id)?.normal_booking_price):
                this._data.type == 'urgent'?this._list?.find(a=>a.id==this._branch)?.employees?.filter(a=>a.employee?.role_id=="1")?.find(a=>a.id==this._doctor)?.periods?.find(a=>a.id==this._data.period_id)?.urgent_booking_price:
                this._data.type == 'follow up'?this._list?.find(a=>a.id==this._branch)?.employees?.filter(a=>a.employee?.role_id=="1")?.find(a=>a.id==this._doctor)?.periods?.find(a=>a.id==this._data.period_id)?.follow_up_booking_price:undefined
            */
           switch(this.data.type){
            case 'urgent': { this._data.price = this._data.period?.urgent_booking_price; break; }
            case 'follow up': { this._data.price = this._data.period?.follow_up_booking_price; break; }
            default:{ this._data.price = this._data.period?.normal_booking_price; break; }
           }
        }else this._data.price =0
    }
    public getDates(dayShort:string):Date[]{
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
          const result: Date[] = [];
          let count = 0;
        
          while (result.length < 4) {
            const nextDate = new Date();
            nextDate.setDate(today.getDate() + count);
            if (nextDate.getDay() === targetDay) {
              result.push(nextDate); // صيغة YYYY-MM-DD
            }
            count++;
          }
        
          return result;
    }

    public send(vm:BookingsPageVM|BookingsPageHistoryVM|ServiceBookingsPageVM|ServiceBookingsPageHistoryVM){
        this.loading(async()=>{
            if(this.validate()){
                let response = await new BookingClient().insert(this.data)
                if(response){
                    Notify({title:'عملية ناجحة' , type:'success' , body:'تم الحجز بنجاح'})
                    Globals.popup.close()
                    vm.getPage()
                }
                this._data = {id:undefined, period:undefined , date:'' , period_id:'' , mobile:'' , email:'' ,reason:'' , name:'' , type:'normal',is_done:0,price:undefined}
            }
            this.update()
        })
    }

    public validate():boolean{
        if(!this.data.name){ Notify({title:'خطأ فى البيانات' , type:'danger' , body:'يجب ادخال الاسم'}) ; return false }
        if(!this.data.mobile){ Notify({title:'خطأ فى البيانات' , type:'danger' , body:'يجب ادخال الموبايل'}) ; return false }
        if(!this.data.period_id){ Notify({title:'خطأ فى البيانات' , type:'danger' , body:'يجب اختيار الفرع و الطبيب و الموعد'}) ; return false }
        return true
    }
}
