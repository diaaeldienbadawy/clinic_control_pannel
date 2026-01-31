import React, { useEffect, useRef, useState } from 'react'
import { ListVM, PaginatedListVM } from '../../MyLib/Structure/ViewModels/Abstracts/ListVM'
import { booking } from '../../Structure/Models/booking'
import { BookingClient } from '../../Structure/Api/Clients/BookingClient'
import { branch } from '../../Structure/Models/branch'
import { UserProfile } from '../../Structure/Models/User'
import { BranchClient } from '../../Structure/Api/Clients/BranchClient'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Col, Container, Row } from 'react-bootstrap'
import CustomSelect from '../../MyLib/Components/CustomSelect'
import Search from '../../MyLib/Components/Search'
import Pagination from '../../Components/Utilities/Pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { faSquareWhatsapp, faWhatsapp, faWhatsappSquare } from '@fortawesome/free-brands-svg-icons'
import { DateTime, Essentials } from '../../MyLib/Structure/Handlers/functions'
import { Booking } from './Booking'
import { ServiceBooking } from './ServiceBooking'
import { useLocation } from 'react-router-dom'
import { GeneralMethods } from '../../MyLib/Structure/Handlers/GeneralMethods'
import CustomPhoneInput from '../../MyLib/Components/CustomPhoneInput'

export const BookingsPageHistory = () => {
  const control = useVM<BookingsPageHistoryVM>(new BookingsPageHistoryVM())
  const location = useLocation()
  useEffect(()=>{ control.getLists() },[])


  const EditItem = (props:{booking:booking})=>{
    const [name, setName] = useState(props.booking.name)
    const [mobile, setMobile] = useState(props.booking.mobile)
    const [email, setEmail] = useState(props.booking.email)
    const [additional, setAdditional] = useState(props.booking.additional)
    const [discount, setDiscount] = useState(props.booking.discount)
    const [paid, setPaid] = useState(props.booking.paid)
    const [status, setStatus] = useState(props.booking.status)
    const [isDone, setIsDone] = useState(props.booking.is_done)
    const [notes, setNotes] = useState(props.booking.notes)

    useEffect(()=>{
      setPaid(Math.ceil((Number(props.booking.price)-Number(discount)+Number(additional))*100)/100)
    },[additional,discount])

    const save = async()=>{
      const data = {...props.booking,name:name,mobile:mobile,whatsapp:email,additional:additional,discount:discount,paid:paid,status:status,isDone:isDone,notes:notes}
      Globals.popup.close()
      await control.updateItem(data)
      control.getPage(Number(new URLSearchParams(location?.search).get('page')??1),true)
    }

    const btn = useRef<HTMLDivElement>(null)

    return(
      <Container>
        <div className='p-2 py-3'>
          <div className='row border  p-1'>
            <div className='col-md-6 col-12 p-2 d-flex justify-content-center'>
              {props.booking.period?.branch_employee?.branch?.name}
            </div>
            <div className='col-md-6 col-12 p-2 d-flex justify-content-center'>
              {props.booking.period?.branch_employee?.employee?.name}
            </div>
            <div className='col-md-6 col-12 p-2 d-flex justify-content-center'>
            {
              props.booking.period?
              (props.booking.period.end_time?(
                props.booking.period?.start_time?DateTime.formatTimeToArabic12Hour(props.booking.period.start_time):null + '<br />'+ DateTime.formatDateToArabic(props.booking.date)
              ):(
                props.booking.period?.start_time?DateTime.formatTimeToArabic12Hour(props.booking.period.start_time):null+ '<br />'+ DateTime.formatDateToArabic(props.booking.date)
              )):null
            }
            </div>
            <div className='col-md-6 col-12 p-2 d-flex justify-content-center'>
              رقم الحجز : {props.booking.booking_number}
            </div>
            <div className=' col-md-6 col-12 p-2 d-flex justify-content-center'>
              نوع الحجز : {props.booking.type=='normal'?'عادي':(props.booking.type == 'follow up'?'استشارة':(props.booking.type=='urgent'?'كشف مستعجل':''))}
            </div>
          </div>
        </div>
        <div className='p-2 py-3'>
          <div className='row border  p-1'>
            <div className='col-lg-4 col-md-6 col-12 p-2 d-flex justify-content-center'>
              <div>
                <div className=' m-auto'>
                  الاسم
                </div>
                <input type="text" placeholder='الاسم' className='input-field w-100 m-auto' onKeyDown={e=>Essentials.EnterKeyPressHandling(e,()=>btn.current?.click())} style={{ maxWidth:'250px' }} value={name} onChange={a=>setName(a.target.value)} />
              </div>
            </div>
            <div className='col-lg-4 col-md-6 col-12 p-2 d-flex justify-content-center'>
              <div>
                <div className=' m-auto'>
                  موبايل
                </div>
                <CustomPhoneInput
                  value={mobile}
                  setFullNumber={a=>setMobile(a)}
                  className='input-field w-100 m-auto'
                  placeholder='الموبايل'
                  style={{ maxWidth:'250px' }}
                />
              </div>
            </div>

            <div className='col-lg-4 col-md-6 col-12 p-2 d-flex justify-content-center'>
              <div>
                <div className='m-auto'>
                  واتساب
                </div>
                <CustomPhoneInput
                  value={email}
                  setFullNumber={a=>setEmail(a)}
                  className='input-field w-100 m-auto'
                  placeholder='واتساب'
                  style={{ maxWidth:'250px' }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='p-2 py-3'>
          <div className='row border p-1'>
            <div className='col-lg-4 col-md-6 col-12 p-2 d-flex justify-content-center'>
              <div className='my-auto'>
                <div className='m-auto'>
                  السعر  
                </div>  
                <div className='m-auto'>
                {props.booking.price} 
                </div>  
              </div>
            </div>
            <div className='col-lg-4 col-md-6 col-12 p-2 d-flex justify-content-center'>
              <div>
                <div className='m-auto'>
                  مدفوعات اضافية
                </div>
                <input type="text" placeholder='مدفوعات اضافية' className='input-field w-100 m-auto' onKeyDown={e=>Essentials.EnterKeyPressHandling(e,()=>btn.current?.click())} style={{ maxWidth:'250px' }} value={additional??'0'} onChange={a=>setAdditional(Number(a.target.value.replace(/[^0-9.]/g, '')))} />
              </div>
            </div>
            <div className='col-lg-4 col-md-6 col-12 p-2 d-flex justify-content-center'>
              <div>
                <div className='m-auto'>
                  خصم
                </div>
                <input type="text" placeholder='خصومات' className='input-field w-100 m-auto' onKeyDown={e=>Essentials.EnterKeyPressHandling(e,()=>btn.current?.click())} style={{ maxWidth:'250px' }} value={discount??'0'} onChange={a=>setDiscount(Number(a.target.value.replace(/[^0-9.]/g, '')))} />
              </div>
            </div>
            <div className='col-12 p-2 d-flex justify-content-center p-3'>
              المطلوب : 
              {paid}
            </div>
          </div>

        </div>
        <div className='p-2 row'>

              <div className='col-md-6 col-12 p-2 d-flex justify-content-center'> 
                <CustomSelect 
                  list={[{label:'تم الدفع', value:'paid'},{label:'لم يتم الدفع', value:'pending'},{label:'حجز ملغى', value:'canceled'}]} 
                  selected={status}
                  onSelect={a=>setStatus(a as 'paid'|'pending'|'canceled')}
                  clearable={false}
                />
              </div>
              <div className='col-md-6 col-12 p-2 d-flex justify-content-center'> 
                <CustomSelect 
                  list={[{label:'تم الكشف', value:'1'},{label:'لم يتم الكشف', value:'0'}]} 
                  selected={isDone.toString()}
                  onSelect={a=>setIsDone(Number(a))}
                  clearable={false}
                />
              </div>
          </div>
          <div className='p-2 row'>
            <div className='col-md-3 col-12 p-2 d-flex justify-content-center'>
              <div className='my-auto'>ملاحظات</div>
            </div>
            <div className='col-md-9 col-12 p-2 d-flex justify-content-center'>
              <textarea placeholder='ملاحظات' className='input-field w-100 my-auto' onKeyDown={e=>Essentials.EnterKeyPressHandling(e,()=>btn.current?.click())} value={notes} onChange={a=>setNotes(a.target.value)} />
            </div>
          </div>
          <div className='p-2 d-flex justify-content-center'>
            <div className='button-I btn-clr-II px-3 py-1 c-pointer' ref={btn} onClick={()=>save()}>حفظ</div>
          </div>
      </Container>
    )
  } 


  return (
    <>
      {
      control.Show(
      <>
        <div  style={{ minHeight:'90%' }}>
          <Row className='py-3 justify-content-center'>
            <Col lg={10} className='p-0'>
              <div className='row g-2 px-md-3 flex-wrap justify-content-start'>
                <div className='col-md-auto col-12 px-1 py-1'>
                  <CustomSelect 
                    list={control.branchs.map(a=>({label:a.name , value:a.id as string}))} 
                    selected={control.branch?.id} 
                    onSelect={a=>control.branch=control.branchs.find(b=>b.id==a)}  
                  />
                </div>
                <div className='col-md-auto col-12 px-1 py-1'>
                  <CustomSelect 
                    list={control.doctors.map(a=>({label:a.name , value:a.id as string}))} 
                    selected={control.doctor?.id} 
                    onSelect={a=>control.doctor=control.doctors.find(b=>b.id==a)}  
                  />
                </div>
                <div className='col-md-auto col-12 px-1 py-1'>
                  <CustomSelect 
                    list={[{label:'معلق',value:'pending'},{label:'مدفوع' , value:'paid'},{label:'ملغى' , value:'canceled'}]} 
                    selected={control.status} 
                    onSelect={a=>control.status=a?(a as 'pending'|'paid'|'canceled'):undefined}  
                  />
                </div>
                <div className='col-md-auto col-12 px-1 py-1' style={{ minHeight:'48px' }}>
                  <input type="date" className='input-field w-100  h-100' value={control.date} onChange={a=>control.date=a.target.value} />
                </div>
                <div className='col-md-auto col-12 px-1 py-1' style={{ minHeight:'48px' }}>
                  <input type="text" placeholder='بحث...' className='input-field w-100 h-100'  value={control.search} onChange={a=>control.search=a.target.value}/>
                </div>
                <div className='col-md-auto col-12 px-1 py-1' style={{ minHeight:'48px' }}>
                  <div className='my-auto d-flex c-pointer btn-clr-II button-I my-auto h-100 px-4 justify-content-center' onClick={()=>control.getPage(control.Data.pagination.current_page)}>
                    <div className='my-auto text-center'>بحث</div>
                  </div>
                </div>
              </div>
              <div className=''>
                {
                  control.Data.data.map((item,index)=>{
                    const Item = (props:{status:"paid" | "pending" | "canceled" | undefined})=>{
                      const [status, setStatus] = useState(props.status)
                      const Accepting = ()=>{
                        const [additional, setAdditional] = useState('')
                        const [discount, setDiscount] = useState('')
                        const [paid, setPaid] = useState('0')
                        useEffect(()=>{
                          let total = Number(additional)-Number(discount)
                          if(item.price) total = Number(total) + Number(item.price)
                            setPaid(Math.max(total,0).toString())
                        },[discount])
                        useEffect(()=>{
                          let total = Number(additional)-Number(discount)
                          if(item.price) total = Number(total) + Number(item.price)
                          setPaid(Math.max(total,0).toString())
                        },[additional])
                        return( 
                        <>                          
                          <div className='p-1 text-center'>
                            <div className='p-1  border rounded-3'>
                                  <div className='row py-2'>
                                    <div className='col-sm-6 col-12 d-flex' >
                                      <div className='my-auto'>المريض</div>
                                    </div>
                                    <div className='col-sm-6 col-12 d-flex'>
                                      <div className='my-auto w-100'>
                                        {item.name}
                                      </div>
                                    </div>
                                  </div>
                                  <div className='row py-2'>
                                    <div className='col-sm-6 col-12 d-flex' >
                                      <div className='my-auto'>الطبيب</div>
                                    </div>
                                    <div className='col-sm-6 col-12 d-flex'>
                                      <div className='my-auto w-100'>
                                        {item.period?.branch_employee?.employee?.name}
                                      </div>
                                    </div>
                                  </div>
                                  <div className='row py-2'>
                                    <div className='col-sm-6 col-12 d-flex' >
                                      <div className='my-auto'>
                                        <FontAwesomeIcon icon={faPhone}/>
                                      </div>
                                    </div>
                                    <div className='col-sm-6 col-12 d-flex'>
                                      <div className='my-auto w-100'>
                                        {item.mobile}
                                      </div>
                                    </div>
                                  </div>
                                  <div className='row py-2'>
                                    <div className='col-sm-6 col-12 d-flex' >
                                      <div className='my-auto'>
                                        <FontAwesomeIcon icon={faWhatsapp}/>
                                      </div>
                                    </div>
                                    <div className='col-sm-6 col-12 d-flex'>
                                      <div className='my-auto w-100'>
                                        {item.email}
                                      </div>
                                    </div>
                                  </div>
                            </div>
                          </div>
                          <div className=' p-1 text-center'>
                            <div className='p-1  border rounded-3'>
                              <div className='row py-2'>
                                <div className='col-sm-6 col-12 d-flex' >
                                  <div className='my-auto'>السعر</div>
                                </div>
                                <div className='col-sm-6 col-12 d-flex'>
                                  <div className='my-auto w-100'>
                                    {item.price}
                                  </div>
                                </div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-6 col-12 d-flex' >
                                  <div className='my-auto'>مدفوعات اضافية</div>
                                </div>
                                <div className='col-sm-6 col-12 d-flex'>
                                  <div className='my-auto'>
                                    <input type="text" className='input-field w-100' value={additional} onChange={a=>setAdditional((a.target.value))} />
                                  </div>
                                </div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-6 col-12 d-flex' >
                                  <div className='my-auto'>خصم</div>
                                </div>
                                <div className='col-sm-6 col-12 d-flex'>
                                  <div className='my-auto'>
                                    <input type="text" className='input-field w-100' value={discount} onChange={a=>setDiscount((a.target.value))} />
                                  </div>
                                </div>
                              </div>
                              <div className='row py-2 pb-4'>
                                <div className='col-sm-6 col-12 d-flex' >
                                  <div className='my-auto'>القيمة المطلوبة</div>
                                </div>
                                <div className='col-sm-6 col-12 d-flex '>
                                  <div className='my-auto w-100'>
                                    {paid}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='d-flex justify-content-center py-2'>
                                <div className='button-I bg-success text-white px-3 py-1 c-pointer'
                                  onClick={()=>{
                                    const stat = status
                                    setStatus('paid')
                                    Globals.popup.close()
                                    control.updateItem({...item,status:'paid',additional:Number(additional) , discount:Number(discount) , paid:Number(paid)},()=>setStatus(stat))
                                  }}
                                >تم الدفع</div>
                              </div>
                          </div>
                        </> 
                        )
                      }
                      const accept = ()=>{
                        Globals.popup.open({
                          content:<Accepting/>
                        })
                      }
                      const done = ()=>{
                        Globals.popup.open({
                          content:
                            <div className='d-flex flex-column justify-content-between h-100'>
                              <div className='text-center h-100 py-4'>
                                هل تريد اتمام الكشف للمريض :
                                {item.name} ؟
                              </div>
                              <div className='d-flex justify-content-center'>
                                <div className='button-I btn-clr-I c-pointer px-3 py-1 fs-6' onClick={()=>{
                                  const fn = async()=>{
                                    Globals.popup.close() 
                                    await control.updateItem({...item,is_done:1})
                                    control.getPage(Number(new URLSearchParams(location?.search).get('page')??1),false)
                                  }
                                  fn()
                                }}>
                                  موافق
                                </div>
                              </div>
                            </div>
                        })

                      }
                      const cancel = ()=>{
                        const stat = status
                        setStatus('canceled')
                        control.updateItem({...item,status:'canceled'},()=>setStatus(stat))
                      }

                      return (
                        <div className='p-3'>
                          <div className='border rounded-3 d-flex flex-column justify-content-between h-100 pt-2'> 
                            <div className='h-100'>
                              <div className='row g-2 py-2'>
                                <div className='col-lg-6 col-12  my-auto'>
                                  <div className='row g-2 w-100'>
                                    <div className='col-sm-6 col-12  my-auto'>
                                    {item.name}
                                    </div>
                                    <div className='col-sm-6 col-12  my-auto'>
                                    {item.period?.branch_employee?.branch?.name}
                                    </div>
                                  </div>
                                </div>
                                <div className='col-lg-6 col-12 my-auto'>
                                  <div className='row g-2 w-100'>
                                    <div className='col-sm-6 col-12 my-auto'>
                                    {item.period?.branch_employee?.employee?.name}
                                    </div>
                                    <div className='col-sm-6 col-12 my-auto'>
                                      {
                                        item.period?
                                        (item.period.end_time?(
                                          item.period?.start_time?DateTime.formatTimeToArabic12Hour(item.period.start_time):null + '<br />'+ DateTime.formatDateToArabic(item.date)
                                        ):(
                                          item.period?.start_time?DateTime.formatTimeToArabic12Hour(item.period.start_time):null+ '<br />'+ DateTime.formatDateToArabic(item.date)
                                        )):null
                                      }                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='row g-2 py-2'>
                                <div className='col-lg-6 col-12  my-auto'>
                                  <div className='row g-2'>
                                    <div className='col-sm-6 col-12  my-auto'>
                                    <span>نوع الحجز : </span>
                                    {item.type=='normal'?'عادي':(item.type=='urgent'?'مستعجل':'متابعة')}
                                    </div>
                                    <div className='col-sm-6 col-12  my-auto'>
                                    <span>رقم الحجز : </span>
                                    {item.booking_number}
                                    </div>
                                  </div>
                                </div>
                                <div className='col-lg-6 col-12  my-auto'>
                                  <div className='row g-2'>
                                    <div className='col-sm-6 col-12 d-flex  my-auto'>
                                    <FontAwesomeIcon className='my-auto ps-2' icon={faPhone}/>
                                    {item.mobile}
                                    </div>
                                    <div className='col-sm-6 col-12  my-auto'>
                                    <FontAwesomeIcon className='my-auto ps-2' icon={faWhatsapp}/>
                                    {item.email}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='row g-3 py-2'>
                              <div className='col-lg-6 col-12  my-auto'>
                                ملاحظات : 
                                {item.notes}
                              </div>
                            </div>
                            <div className='row justify-content-between'>
                              <div className='p-1 fw-bold  col-md-auto col-12  my-auto d-flex flex-wrap'>
                                <div className='px-2 text-success'>
                                  السعر : {item.price?(item.price==0?'مجانا':(item.price+'')):''}
                                </div>
                                {
                                  item.additional?(
                                    <div className='px-2 fw-normal'>
                                      اضافى : {item.additional}
                                    </div>
                                  ):(null)
                                }
                                {
                                  item.discount?(
                                    <div className='px-2 fw-normal'>
                                      خصم : {item.discount}
                                    </div>
                                  ):(null)
                                }
                                {
                                  item.paid?(
                                    <div className='px-2 fw-normal'>
                                      المدفوع : {item.paid}
                                    </div>
                                  ):(null)
                                }
                              </div>
                              <div className=' col-md-auto col-12 justify-content-md-end justify-content-center my-auto'>
                                <div className='row d-flex my-auto'>
                                  <div className='color-gray p-2 col-md-auto col-12 my-auto'>
                                    {status === 'paid'?'تم الدفع':(status === 'canceled'?'تم الغاء الحجز':'لم يتم الدفع') } 
                                  </div> 
                                  <div className='color-gray p-2 col-md-auto col-12 my-auto'>
                                    {item.is_done == 1?'تم الكشف':'لم يتم الكشف'} 
                                  </div>
                                  <div className='btn-clr-save p-2 col-md-auto col-12 my-auto c-pointer' onClick={()=>{
                                    Globals.popup.open({
                                      title:'تعديل الحجز',
                                      content:<EditItem booking={item} />
                                    })
                                  }}>
                                    تعديل
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  return (<Item status={item.status}/>)
                  })
                }
              </div>
            </Col>
          </Row>
        </div>
      </>
      )
      }
      <div className='py-3'>
        <Pagination pagesCount={control.Data?.pagination.total_pages||1} initial={0} onPageChange={(page)=>{ if(control.Data.pagination.current_page != Number(page)) control.getPage(Number(page), false) }  }/>
      </div>
    </>
  )
}

export class BookingsPageHistoryVM extends PaginatedListVM<booking>{
  constructor(){
    super(BookingClient , true )
  }
  
  private _search : string = '';
  public get search() : string {
    return this._search;
  }
  public set search(v : string) {
    this._search = v;
    this.update()
  }
  
  
  private _status : 'pending'|'paid'|'canceled'|undefined;
  public get status() : 'pending'|'paid'|'canceled'|undefined {
    return this._status;
  }
  public set status(v : 'pending'|'paid'|'canceled'|undefined) {
    this._status = v;
    this.update()
  }
  
  
  private _date : string = '';
  public get date() : string {
    return this._date;
  }
  public set date(v : string) {
    this._date = v;
    this.update()
  }
  

  private _branch : branch|undefined;
  public get branch() : branch|undefined {
    return this._branch;
  }
  public set branch(v : branch|undefined) {

      this.loading(async()=>{
        this._branch = v;
        if(this._branch){
          const docs = this._branch.employees?.filter(a=>a.employee?.role_id=="1")
          this._doctors = this._branch?(docs?(docs.length?docs.map(a=>a.employee as UserProfile):[]):[]):[]
        }
      })

    this.update()
  }
  
  private _branchs : branch[] = [];
  public get branchs() : branch[] {
    return this._branchs;
  }
  public set branchs(v : branch[]) {
    this._branchs = v;
    this.update()
  }

  
  
  private _doctor : UserProfile|undefined;
  public get doctor() : UserProfile|undefined {
    return this._doctor;
  }
  public set doctor(v : UserProfile|undefined) {
    this._doctor = v;
    this.update()
  }
  

  private _doctors : UserProfile[] = [];
  public get doctors() : UserProfile[] {
    return this._doctors;
  }
  public set doctors(v : UserProfile[]) {
    this._doctors = v;
    this.update()
  }
  
  public getLists(){
    this.loading(async()=>{
      let list = await new BranchClient().getAll()
      if(list && list.length>0){
        this._branchs = list
        const array = list.filter(a=>a.employees?.filter(b=>b.employee_id===Globals.auth.Profile?.id).length != 0 )
        this._branch = array.length>0?array[0]:undefined
        if(this._branch){
          const docs = this._branch.employees?.filter(a=>a.employee?.role_id=="1")
          this._doctors = this._branch?(docs?(docs.length?docs.map(a=>a.employee as UserProfile):[]):[]):[]
        }
      }
      const BookingClient = new this.clientType()
      if( this._branch && this._branch.id ) BookingClient.addParameter( 'branch' , this._branch.id )
      if(this._doctor && this._doctor.id)BookingClient.addParameter('employee',this._doctor.id)
      if(this._status)BookingClient.addParameter('status',this._status)
      if( this._search ) BookingClient.addParameter( 'search' , this._search )
      if(this._date) BookingClient.addParameter( 'date'  ,this._date )
      BookingClient.addParameter('is_done','1')

      let response = await BookingClient.getPage( 1 , true)
      if(response){
         this.data = response 
      }
      this.update()
    })
  }

  public getPage(page?: number, reverse?: boolean): void {
    if(page==undefined)  page = Number(new URLSearchParams(window.location.search).get('page') ?? '1')
    this.loading(async()=>{
      const BookingClient = new this.clientType()
      if(this._branch && this._branch.id)BookingClient.addParameter('branch',this._branch.id)
      if(this._doctor && this._doctor.id)BookingClient.addParameter('employee',this._doctor.id)
      if(this._status)BookingClient.addParameter('status',this._status)
      if(this._search)BookingClient.addParameter('search',this._search)
      if(this._date) BookingClient.addParameter('date',this._date)
      BookingClient.addParameter('is_done','1')

      let response = await BookingClient.getPage(page,true)
      if(response){
        this.data = response 
      }
      this.update()
    })
  }

  public async updateItem(item:booking , onFail?:()=>void){
    const response = await new BookingClient().insert(item)
    if(!response && onFail)onFail()
  }
  
}


