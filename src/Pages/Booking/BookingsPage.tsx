import React, { useEffect, useState } from 'react'
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
import { faMailBulk, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faSquareWhatsapp, faWhatsapp, faWhatsappSquare } from '@fortawesome/free-brands-svg-icons'
import { DateTime } from '../../MyLib/Structure/Handlers/functions'
import { Booking } from './Booking'
import { ServiceBooking } from './ServiceBooking'
import { useLocation } from 'react-router-dom'

export const BookingsPage = () => {
  const control = useVM<BookingsPageVM>(new BookingsPageVM())
  const location = useLocation()
  useEffect(()=>{ control.getLists() },[])
  return (
    <div className='d-flex flex-column justify-content-between h-100'>
    {
        control.Show(
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
              <div className='d-flex px-2 flex-wrap'>
                <div className='d-flex color-III c-pointer'
                  onClick={()=>{
                    Globals.popup.open({
                      content:<Booking vm={control}/>
                    })
                  }}
                >
                  <div className='px-1 my-auto fs-4 fw-bold'>+</div>
                  <div className='px-1 my-auto fs-5'>حجز جديد</div>
                </div>
                <div className='px-5 py-1'>

                </div>
                {/* <div className='d-flex color-III c-pointer'
                  onClick={()=>{
                    Globals.popup.open({
                      content:<ServiceBooking vm={control}/>
                    })
                  }}
                >
                  <div className='px-1 my-auto fs-4 fw-bold'>+</div>
                  <div className='px-1 my-auto fs-5'>حجز خدمة</div>
                </div> */}
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
                                        <FontAwesomeIcon icon={faMailBulk}/>
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
                                    <input type="text" className='input-field w-100' value={additional} onChange={a=>setAdditional((a.target.value.replace(/[^0-9]/g,'')))} />
                                  </div>
                                </div>
                              </div>
                              <div className='row py-2'>
                                <div className='col-sm-6 col-12 d-flex' >
                                  <div className='my-auto'>خصم</div>
                                </div>
                                <div className='col-sm-6 col-12 d-flex'>
                                  <div className='my-auto'>
                                    <input type="text" className='input-field w-100' value={discount} onChange={a=>setDiscount((a.target.value.replace(/[^0-9]/g,'')))} />
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
                                          <>{
                                          (item.period?.start_time?DateTime.formatTimeToArabic12Hour(item.period.start_time):null)}<br /> {DateTime.formatDateToArabic(item.date)
                                          }</>
                                        ):(
                                          <>{
                                          (item.period?.start_time?DateTime.formatTimeToArabic12Hour(item.period.start_time):null)} <br /> {DateTime.formatDateToArabic(item.date)
                                          }</>
                                        )):null
                                      }
                                    </div>
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
                                    <FontAwesomeIcon className='my-auto ps-2' icon={faMailBulk}/>
                                    {item.email}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {
                                item.reason?(
                                  <div className='row g-3 py-2'>
                                    <div className='col-sm-6 col-12  my-auto'>
                                    <span>سبب الحجز : </span>
                                    {item.reason}
                                    </div>
                                  </div>
                                ):null
                              }
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
                              {
                                status?(
                                  status === 'paid' ?(
                                    <div className='row d-flex my-auto'>
                                      <div className='text-success p-2 col-md-auto col-12 my-auto' >تم الدفع</div>
                                      <div className=' btn-delete p-2 c-pointer col-md-auto col-12 my-auto' onClick={()=>cancel()}>الغاء الحجز</div>
                                      <div className=' col-md-auto col-12 my-auto'>
                                        <div className='material-symbols-outlined btn-success bg-success text-white rounded-1 px-2 c-pointer' onClick={()=>done()}>
                                          check
                                        </div>
                                      </div>
                                      {/* <div className=' btn-clr-save p-2 c-pointer col-md-auto col-12 my-auto' onClick={()=>Globals.popup.open({
                                content:<ServiceBooking vm={control} booking={item} />
                              })}>حجز خدمة</div> */}
                                    </div>
                                  ):(
                                    status === 'pending' ?(
                                    <div className='row d-flex  my-auto'>
                                      <div className=' text-warning p-2 col-md-auto col-12 my-auto' >معلق</div>
                                      <div className=' btn-clr-save p-2 c-pointer col-md-auto col-12 my-auto' onClick={()=>accept()}>اتمام</div>
                                      <div className=' btn-delete p-2 c-pointer col-md-auto col-12 my-auto' onClick={()=>cancel()}>الغاء الحجز</div>
                                      {/* <div className=' btn-clr-save p-2 c-pointer col-md-auto col-12 my-auto' onClick={()=>Globals.popup.open({
                                content:<ServiceBooking vm={control} booking={item} />
                              })}>حجز خدمة</div> */}
                                    </div>
                                    ):(
                                    <div className='row d-flex  my-auto col-md-auto col-12 my-auto'>
                                      <div className=' color-gray p-2 col-md-auto col-12 my-auto' >ملغى</div>
                                      {/* <div className=' btn-clr-save p-2 c-pointer col-md-auto col-12 my-auto' onClick={()=>Globals.popup.open({
                                        content:<ServiceBooking vm={control} booking={item} />
                                        })}>حجز خدمة</div> */}
                                              </div>
                                              )
                                            )
                                          ):null
                                        }
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
        )
      }

      <div>
        <Pagination pagesCount={control.Data?.pagination.total_pages||1} initial={0} onPageChange={(page)=>{ if(control.Data.pagination.current_page != Number(page)) control.getPage(Number(page), false) }  }/>
      </div>
    </div>
  )
}

export class BookingsPageVM extends PaginatedListVM<booking>{
  constructor(){
    super(BookingClient , false )
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
      BookingClient.addParameter('is_done','0')

      let response = await BookingClient.getPage( 1 , false)
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
      BookingClient.addParameter('is_done','0')

      let response = await BookingClient.getPage(page)
      if(response){
        this.data = response 
      }
      this.update()
    })
  }

  public async updateItem(item:booking , onFail?:()=>void){
    const response = await new BookingClient().insert(item)
    if(response)this.data.data = [...this.data.data.map(a=>a.id==item.id?response:a)]
    if(!response && onFail)onFail()
    this.update()
  }
  
}


