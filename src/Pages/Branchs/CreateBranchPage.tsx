import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { EditablePageVM } from '../../MyLib/Structure/ViewModels/Abstracts/EditablePageVM'
import { branch } from '../../Structure/Models/branch'
import { UserProfile } from '../../Structure/Models/User'
import { period } from '../../Structure/Models/period'
import { EmployeeClient } from '../../Structure/Api/Clients/EmployeeClient'
import { BranchClient } from '../../Structure/Api/Clients/BranchClient'
import { BranchEmployeeClient } from '../../Structure/Api/Clients/BranchEmployeeClient'
import { PeriodClient } from '../../Structure/Api/Clients/PeriodClient'
import { Notify } from '../../MyLib/Structure/Handlers/Notifications'
import { navigator } from '../../MyLib/Components/Facilities'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { UserAdminClient } from '../../Structure/Api/Clients/UserAdminClient'
import { useParams } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import CustomPhoneInput from '../../MyLib/Components/CustomPhoneInput'
import { Essentials } from '../../MyLib/Structure/Handlers/functions'
import CustomSelect from '../../MyLib/Components/CustomSelect'
import { Role } from '../../Structure/Models/Role'
import { GeneralMethods } from '../../MyLib/Structure/Handlers/GeneralMethods'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { branchEmployee } from '../../Structure/Models/branchEmployee'
import { SubServiceClient } from '../../Structure/Api/Clients/SubServiceClient'
import { subService } from '../../Structure/Models/subService'
import { SubService } from './SubService'


const CreateBranchPage = () => {
  const {id} = useParams<{id:string}>()
  //const control = useVM<EditableBranchPageVM>(id?(new EditBranchPageVM(id)):(new CreateBranchPageVM()))
  const control = useVM<EditableBranchPageVM>(new EditableBranchPageVM())
  useEffect(()=>{control.initiate() },[])
  useEffect(()=>{ console.log(control.data) },[control.data])

  const TimeValidating = (value:string):string=>{
    if(value=='00:00:00')value= '00:00'
    else {
      value = value.replace(/[^0-9:]/g, "")
      if(value.length !=2){
        if (value.length >= 2) {
          if(value[0]==':')value = value.replace(':','')
          if(value[1]==':')value = value.replace(':','') 
          value = value.substring(0, 2).replace(/[^0-9]/g, "") + ":" + value.substring(3, 5).replace(/[^0-9]/g, ""); // إدراج ":" بعد أول رقمين تلقائيًا
        }else value = value.replaceAll(':','')
      }
    } 
    return value
  }

  const daysList:{label:string , value:string}[] =
    [
      {label:"السبت" , value:'Sat'},
      {label:"الاحد" , value:'Sun'},
      {label:"الاثنين" , value:'Mon'},
      {label:"الثلاثاء" , value:'Tue'},
      {label:"الاربعاء" , value:'Wed'},
      {label:"الخميس" , value:'Thu'},
      {label:"الجمعة" , value:'Fri'},
    ]

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.select();
    };

    /*const Period:React.FC<{ user :UserProfile, period:period, index:number}> = ({ user, period,index})=>{
      const [edit, setEdit] = useState(false)
      const [day, setDay] = useState(period.day)
      const [time, setTime] = useState(period.time)
      const [normalPrice, setNormalPrice] = useState(period.normal_booking_price??0)
      const [urgentPrice, setUrgentPrice] = useState(period.urgent_booking_price??0)
      const [followUpPrice, setFollowUpPrice] = useState(period.follow_up_booking_price??0)

      const inputRef1 = useRef<HTMLInputElement>(null);
      const inputRef2 = useRef<HTMLInputElement>(null);
      const inputRef3 = useRef<HTMLInputElement>(null);
  
      useEffect(()=>{
        if (inputRef1.current) {
          const preventScroll = (event: WheelEvent) => event.preventDefault();
          inputRef1.current.addEventListener("wheel", preventScroll);
        }
        if (inputRef2.current) {
          const preventScroll = (event: WheelEvent) => event.preventDefault();
          inputRef2.current.addEventListener("wheel", preventScroll);
        }
        if (inputRef3.current) {
          const preventScroll = (event: WheelEvent) => event.preventDefault();
          inputRef3.current.addEventListener("wheel", preventScroll);
        }
  
      },[])

      const editPeriod = ()=>{
        period.day = day
        period.time = time
        period.normal_booking_price = normalPrice
        period.urgent_booking_price = urgentPrice
        period.follow_up_booking_price = followUpPrice
        control.editEmployeePeriod(user , period)
      }

      return(
        edit?(
          <div className=' p-2 w-100' style={{ background:edit?'rgb(119, 205, 255,0.23)':index%2?'rgba(235,235,235,0.95)':'rgba(210,210,210,0.8)' }}>
            <div className='d-flex justify-content-between w-100 flex-lg-nowrap flex-wrap flex-wrap-reverse'>
              <div className='d-flex flex-lg-nowrap flex-wrap w-100 '>
                <div className='d-flex p-2 w-100'  style={{ maxWidth:'300px' }} >
                  <CustomSelect
                      list={daysList}
                      clearable={false}
                      selected={day}
                      onSelect={a=>setDay(a)}
                    ></CustomSelect>
                </div>
                <div className='d-flex p-2 w-100' >
                  <input className='input-field w-100' style={{ maxWidth:'200px' }}  lang="ar" type="time" value={time} onChange={a=>setTime(a.target.value)}  />
                </div>
              </div>
              <div className='d-flex'>
                  <div className='material-symbols-outlined btn-clr-save my-auto c-pointer fs-5  px-3' onClick={()=>editPeriod()}>
                    save
                  </div>
                  <div className='material-symbols-outlined btn-delete my-auto c-pointer  px-3' onClick={()=>{
                      Globals.popup.open({
                        content:<div className='d-flex flex-column h-100'>
                          <div className='d-flex flex-column justify-content-center h-100'>
                            <div>هل تريد حذف الموعد .. {period.day} {period.time}</div>
                            <div>تنبيه مهم ... سيتم حذف جميع الحجوزات المرتبطة بالموعد المحدد لهذا الطبيب</div>
                          </div>
                          <div className='d-flex justify-content-center'>
                            <div className='button-I btn-clr-II px-3 py-1 c-pointer' onClick={()=>control.removeEmployeePeriod(user as UserProfile,period)}>موافق</div>
                          </div>
                        </div>
                      })
                    }}>
                    close
                  </div>
                </div>
            </div>
            <div className='d-flex p-2 justify-content-between w-100 flex-md-nowrap flex-wrap' >
              <div >الكشف العادي</div>
              <input ref={inputRef1} className='input-field  w-100' style={{ maxWidth:'200px' }} lang="ar" type="number" value={normalPrice??0} onChange={a=>setNormalPrice(Number(a.target.value))}  />
            </div>
            <div className='d-flex p-2 justify-content-between w-100 flex-md-nowrap flex-wrap' >
              <div>الكشف المستعجل</div>
              <input ref={inputRef2} className='input-field   w-100' style={{ maxWidth:'200px' }}  lang="ar" type="number" value={urgentPrice??0} onChange={a=>setUrgentPrice(Number(a.target.value))}  />
            </div>
            <div className='d-flex p-2 justify-content-between w-100 flex-md-nowrap flex-wrap' >
              <div>الاستشارة</div>
              <input ref={inputRef3} className='input-field w-100' style={{ maxWidth:'200px' }}  lang="ar" type="number" value={followUpPrice??0} onChange={a=>setFollowUpPrice(Number(a.target.value))}  />
            </div>
        </div>
        ):(
        <div className='d-flex p-2 justify-content-between' style={{ background:index%2?'rgba(235,235,235,0.95)':'rgba(210,210,210,0.8)' }}>
          <div className='d-flex justify-content-around w-100 row'>
            <div className='px-2 col-lg-auto col-12'>
              {daysList.find(a=>a.value==day)?.label}
            </div>
            <div className='px-2 col-lg-auto col-12'>
              {GeneralMethods.formatTime(time)}
            </div>
            <div className='px-2 col-lg-auto col-12'>
             عادي : {normalPrice ?? 0 }
            </div>
            <div className='px-2 col-lg-auto col-12'>
            مستعجل : {urgentPrice?? 0 }
            </div>
            <div className='px-2 col-lg-auto col-12'>
            استشارة : {followUpPrice?? 0 }
            </div>
          </div>
          <div className='d-flex'>
            <div className='material-symbols-outlined btn-clr-save c-pointer fs-5 my-md-auto px-md-3' onClick={()=>setEdit(true)}>
              edit
            </div>
            <div className='material-symbols-outlined btn-delete c-pointer my-md-auto px-md-3' onClick={()=>{
                Globals.popup.open({
                  content:
                  <div className=' d-flex flex-column h-100'>
                    <div className=' d-flex flex-column justify-content-center h-100'>
                      <div>هل تريد حذف الموعد .. {period.day} {period.time}</div>
                      <div>تنبيه مهم ... سيتم حذف جميع الحجوزات المرتبطة بالموعد المحدد لهذا الطبيب</div>
                    </div>
                    <div className='d-flex justify-content-center'>
                      <div className=' button-I btn-clr-II c-pointer px-3 py-1' onClick={()=>control.removeEmployeePeriod(user as UserProfile,period)}>موافق</div>
                    </div>
                  </div>
                })
              }}>
              close
            </div>
          </div>

        </div>)
      )
    }*/

      const Period:React.FC<{ user :UserProfile, period:period, index:number}> = ({ user, period,index})=>{
        const [edit, setEdit] = useState(false)
        const [day, setDay] = useState(period.day)
        const [startTime, setStartTime] = useState(period.start_time)
        const [endTime, setEndTime] = useState(period.end_time)
  
        const inputRef1 = useRef<HTMLInputElement>(null);
        const inputRef2 = useRef<HTMLInputElement>(null);
        const inputRef3 = useRef<HTMLInputElement>(null);
    
        useEffect(()=>{
          if (inputRef1.current) {
            const preventScroll = (event: WheelEvent) => event.preventDefault();
            inputRef1.current.addEventListener("wheel", preventScroll);
          }
          if (inputRef2.current) {
            const preventScroll = (event: WheelEvent) => event.preventDefault();
            inputRef2.current.addEventListener("wheel", preventScroll);
          }
          if (inputRef3.current) {
            const preventScroll = (event: WheelEvent) => event.preventDefault();
            inputRef3.current.addEventListener("wheel", preventScroll);
          }
    
        },[])
  
        const editPeriod = ()=>{
          period.day = day
          period.start_time = startTime
          period.end_time = endTime
          control.editEmployeePeriod(user , period)
          control.update()
        }
  
        return(
          edit?(
            <div className=' p-2 w-100' style={{ background:edit?'rgb(119, 205, 255,0.23)':index%2?'rgba(235,235,235,0.95)':'rgba(210,210,210,0.8)' }}>
              <div className='d-flex justify-content-between w-100 flex-lg-nowrap flex-wrap flex-wrap-reverse'>
                <div className='d-flex flex-lg-nowrap flex-wrap w-100 '>
                  <div className='d-flex p-2 w-100'  style={{ maxWidth:'300px' }} >
                    <CustomSelect
                        list={daysList}
                        clearable={false}
                        selected={day}
                        onSelect={a=>setDay(a)}
                      ></CustomSelect>
                  </div>
                  <div className='d-flex p-2 w-100' >
                    <div className='d-flex justify-content-start px-2'>
                      <input className='input-field w-100' style={{ maxWidth:'200px' }}  lang="ar" type="time" value={startTime} onChange={a=>setStartTime(a.target.value)}  />
                    </div>
                    <div className='d-flex justify-content-start px-2'>
                      <input className='input-field w-100' style={{ maxWidth:'200px' }}  lang="ar" type="time" value={endTime} onChange={a=>setEndTime(a.target.value)}  />
                    </div>
                  </div>
                </div>
                <div className='d-flex'>
                    <div className='material-symbols-outlined btn-clr-save my-auto c-pointer fs-5  px-3' onClick={()=>editPeriod()}>
                      save
                    </div>
                    <div className='material-symbols-outlined btn-delete my-auto c-pointer  px-3' onClick={()=>{
                        Globals.popup.open({
                          content:<div className='d-flex flex-column h-100'>
                            <div className='d-flex flex-column justify-content-center h-100'>
                              <div>هل تريد حذف الموعد .. {period.day} {period.end_time?(`من ${period.start_time} الى ${period.end_time}`):period.start_time}</div>
                              <div>تنبيه مهم ... سيتم حذف جميع الحجوزات المرتبطة بالموعد المحدد لهذا الطبيب</div>
                            </div>
                            <div className='d-flex justify-content-center'>
                              <div className='button-I btn-clr-II px-3 py-1 c-pointer' onClick={()=>control.removeEmployeePeriod(user as UserProfile,period)}>موافق</div>
                            </div>
                          </div>
                        })
                      }}>
                      delete
                    </div>
                  </div>
              </div>
          </div>
          ):(
          <div className='d-flex p-2 justify-content-between' style={{minWidth:'280px'}}>
            <div className='d-flex p-2 justify-content-between rounded-2 border w-100'>
              <div className='d-flex justify-content-center'>
                <div className='px-2 '>
                  {daysList.find(a=>a.value==day)?.label}
                </div>
                <div className='px-2'>
                  {
                    endTime?(
                      'من '+GeneralMethods.formatTime(startTime)+' الى '+GeneralMethods.formatTime(endTime)
                    ):
                      GeneralMethods.formatTime(startTime)
                  }
                </div>
              </div>
              <div className='d-flex'>
                <div className='material-symbols-outlined btn-clr-save c-pointer fs-5 my-md-auto px-md-3' onClick={()=>setEdit(true)}>
                  edit
                </div>
                <div className='material-symbols-outlined btn-delete c-pointer my-md-auto px-md-3' onClick={()=>{
                    Globals.popup.open({
                      content:
                      <div className=' d-flex flex-column h-100'>
                        <div className=' d-flex flex-column justify-content-center h-100'>
                          <div>هل تريد حذف الموعد .. {period.day} {period.end_time?(`من ${period.start_time} الى ${period.end_time}`):period.start_time}</div>
                          <div>تنبيه مهم ... سيتم حذف جميع الحجوزات المرتبطة بالموعد المحدد لهذا الطبيب</div>
                        </div>
                        <div className='d-flex justify-content-center'>
                          <div className=' button-I btn-clr-II c-pointer px-3 py-1' onClick={()=>control.removeEmployeePeriod(user as UserProfile,period)}>موافق</div>
                        </div>
                      </div>
                    })
                  }}>
                  delete
                </div>
              </div>
            </div>

  
          </div>)
        )
      }

  const Additional =(props:{vm:EditableBranchPageVM})=>{

    const [value, setValue] = useState('')
    const addBut = useRef<HTMLDivElement>(null)
    const [employee, setEmployee] = useState<UserProfile>()

    const [list, setList] = useState<{label:string , value:string}[]>([])
    useEffect(()=>{
      if(control.employeesList.length == control.data.employees?.length){
        setList([])
      }else {
        let filtered = control.employeesList.filter(a=>{
          let avail = true
          control.data.employees?.map(b=>{ if(b.employee?.id==a.id) avail =false })
          return avail
        })
        setList(filtered?(filtered.length?filtered.map(a=>({label:(a.role?.role??'')+ ' - '+a.name , value:a.id??''})):[]):[])
      }
  
      
    },[control.data.employees])

    useEffect(()=>{ setEmployee(control.employeesList.find(a=>a.id==value) as UserProfile) },[value])

    return (
      <div className='d-flex flex-wrap'>
        <h5 className='my-auto p-2'>اضافة موظف</h5>
        <div className='d-flex'>
          <CustomSelect 
            list={list}
            
            onKeyDown={(a)=>Essentials.EnterKeyPressHandling(a,()=>addBut.current?.click())}
            selected={value}
            onSelect={a=>setValue(a)}
          />
          <div ref={addBut} className='material-symbols-outlined my-auto px-2 btn-clr-save c-pointer' onClick={()=>{if(employee)props.vm.addEmployee(employee)}}>add</div>
        </div>
      </div>
    )
  }

  const AdditionalSubService =(props:{vm:EditableBranchPageVM , item:branchEmployee})=>{

    const [value, setValue] = useState('')
    const addBut = useRef<HTMLDivElement>(null)
    const [subService, setSubService] = useState<subService>()

    const [list, setList] = useState<{label:string , value:string}[]>([])
    useEffect(()=>{
      if(control.subServicesList.length == props.item.sub_services?.length){
        setList([])
      }else {
        let filtered = control.subServicesList.filter(a=>{
          let avail = true
          props.item.sub_services?.map(b=>{ if(b.sub_service_id==a.id) avail =false })
          return avail
        })
        setList(filtered?(filtered.length?filtered.map(a=>({label:(a.service??'') , value:a.id??''})):[]):[])
      }
  
      
    },[control.data.employees])

    useEffect(()=>{ setSubService(control.subServicesList.find(a=>a.id==value) as subService) },[value])

    return (
      <div className='d-flex flex-wrap p-2'>
        <h5 className='my-auto p-2'>اضافة خدمة</h5>
        <div className='d-flex'>
          <CustomSelect 
            list={[...list,{label:'خدمة جديدة..',value:'newService'}]}
            
            onKeyDown={(a)=>Essentials.EnterKeyPressHandling(a,()=>addBut.current?.click())}
            selected={value}
            onSelect={a=>{
              if(a=='newService'){
                Globals.popup.open({
                  content:<SubService/>
                })
              }else setValue(a)
            }}
          />
          <div ref={addBut} className='material-symbols-outlined my-auto px-2 btn-clr-save c-pointer' 
            onClick={()=>{if(subService){
              props.item.sub_services?.push({sub_service_id:subService.id,sub_service:subService,duration:subService.duration})
              props.vm.editEmployee(props.item)
              props.vm.update()
              }
            }
          }>add</div>
        </div>
      </div>
    )
  }


  const AddPeriod = (props:{employee:UserProfile , normal:number , urgent:number , followUp:number})=>{
    const [day, setDay] = useState('Sat')
    const [startTime, setStartTime] = useState('00:00')
    const [endTime, setEndTime] = useState<string|undefined>(undefined)

    const inputRef1 = useRef<HTMLInputElement>(null);
    const inputRef2 = useRef<HTMLInputElement>(null);
    const inputRef3 = useRef<HTMLInputElement>(null);

    useEffect(()=>{
      if (inputRef1.current) {
        const preventScroll = (event: WheelEvent) => event.preventDefault();
        inputRef1.current.addEventListener("wheel", preventScroll);
      }
      if (inputRef2.current) {
        const preventScroll = (event: WheelEvent) => event.preventDefault();
        inputRef2.current.addEventListener("wheel", preventScroll);
      }
      if (inputRef3.current) {
        const preventScroll = (event: WheelEvent) => event.preventDefault();
        inputRef3.current.addEventListener("wheel", preventScroll);
      }

    },[])

    return(
      <div className='d-flex flex-column justify-content-between text-center'>
        <div className='w-100'>
          <h5 className='pb-3'>موعد جديد</h5>
          <div className='row p-2 justify-content-between'>
            <div className='d-flex   col-12 d-flex justify-content-sm-start justify-content-center' >
              <CustomSelect
                  list={daysList}
                  clearable={false}
                  selected={day}
                  onSelect={a=>setDay(a)}
                ></CustomSelect>
            </div>
            <div className='d-flex py-2  col-12 d-flex justify-content-sm-end justify-content-center' >
              <input className='input-field w-100 h-100' lang="ar" type="time" value={startTime} onChange={a=>setStartTime(a.target.value)}  />
            </div>
            <div className='d-flex py-2  col-12 d-flex justify-content-sm-end justify-content-center' >
              <input className='input-field w-100 h-100' lang="ar" type="time" value={endTime} onChange={a=>setEndTime(a.target.value)}  />
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center pt-4'>
          <div className=' button-I btn-clr-II px-3 py-1 my-auto' onClick={()=>
            {
              Globals.popup.close()
              control.addEmployeePeriod(props.employee , {start_time:startTime , end_time :endTime, day:day , normal_booking_price:props.normal , urgent_booking_price:props.urgent, follow_up_booking_price:props.followUp})
          }}>
            اضافة
          </div>
        </div>

      </div>
    )
  }



  const FollowUpNo:FC<{item:branchEmployee}> = ({item})=>{
    const [noFollowUps, setNoFollowUps] = useState(item.no_follow_ups??'')
    const [id, setid] = useState(Math.floor(Math.random()*100))

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
      if (inputRef.current) {
        const preventScroll = (event: WheelEvent) => event.preventDefault();
        inputRef.current.addEventListener("wheel", preventScroll);
      }
    },[])

    useEffect(()=>{
      item.no_follow_ups = noFollowUps
      control.editEmployee(item)
    },[noFollowUps])
    return (
      <div className='d-flex flex-column text-center justify-content-start   h-100'>
        <div className=' p-1 mx-auto'>
          <div className='p-2 mx-auto '>
            عدد الاستشارات المسموح
          </div>
          <div className='w-100'>
            <input ref={inputRef} type="number" className='input-field w-100' value={noFollowUps}  onChange={a=>setNoFollowUps(Number(a.target.value).toString())} disabled={ noFollowUps==''} />
          </div>
        </div>
        <div className='d-flex p-1 justify-content-center'>
          <input type="checkbox" id={id.toString()} checked={ noFollowUps==''} style={{ scale:'1.3'  }} onChange={a=>setNoFollowUps(a.target.checked?'':"0")} />
          <label className='p-2' htmlFor={id.toString()}>
            غير محدود
          </label>
        </div>
      </div>
    )
  }

  const FollowUpWeeks:FC<{item:branchEmployee}> = ({item})=>{
    const [followUpWeeks, setFollowUpWeeks] = useState(item.follow_up_weeks??'')
    const [id, setid] = useState(Math.floor(Math.random()*100))


    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
      if (inputRef.current) {
        const preventScroll = (event: WheelEvent) => event.preventDefault();
        inputRef.current.addEventListener("wheel", preventScroll);
      }
    },[])

    useEffect(()=>{
      item.follow_up_weeks = followUpWeeks
      control.editEmployee(item)
    },[followUpWeeks])

    return (
      <div className='d-flex flex-column text-center justify-content-start   h-100'>
        <div className=' p-1 mx-auto'>
          <div className='p-2 mx-auto '>
            اسابيع الاستشارة
          </div>
          <div className=''>
            <input ref={inputRef} type="number" className='input-field w-100' value={followUpWeeks} onChange={a=>setFollowUpWeeks(Number(a.target.value).toString())} disabled={ followUpWeeks==''} />
          </div>
        </div>
        <div className='d-flex p-1 justify-content-center'>
          <input type="checkbox" id={id.toString()} checked={ followUpWeeks==''} style={{ scale:'1.3'  }} onChange={a=>setFollowUpWeeks(a.target.checked?'':"0")} />
          <label className='p-2' htmlFor={id.toString()}>
           غير محدود
          </label>
        </div>
      </div>
    )
  }

  const Duration:FC<{item:branchEmployee}> = ({item})=>{
    const [duration, setDuration] = useState(item.duration=='00:00:00'?'00:00':(item.duration??'00:00'))
    const [id, setid] = useState(Math.floor(Math.random()*100))


    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
      if (inputRef.current) {
        const preventScroll = (event: WheelEvent) => event.preventDefault();
        inputRef.current.addEventListener("wheel", preventScroll);
      }
    },[])

    useEffect(()=>{
      item.duration = duration
      control.editEmployee(item)
    },[duration])

    const validate = (value:string)=>{
      value = TimeValidating(value)
      setDuration(value)
    }

    return (
      <div className='d-flex flex-column text-center justify-content-start  h-100'>
        <div className=' p-1 mx-auto'>
          <div className='p-2 mx-auto '>
            فترة الكشف
          </div>
          <div className=''>
            <input ref={inputRef} type="text" className='input-field w-100 time-duration' pattern="^[0-5]?[0-9]:[0-5][0-9]$" value={ duration } placeholder="MM:SS" maxLength={5} onChange={a=>validate(a.target.value)} disabled={ duration == '00:00' } />
          </div>
        </div>
        <div className='d-flex p-1 justify-content-center'>
          <input type="checkbox" id={id.toString()} checked={ duration == '00:00' } style={{ scale:'1.3'  }} onChange={a=>setDuration(a.target.checked?'00:00':'')} />
          <label className='p-2' htmlFor={id.toString()}>
            غير محدود
          </label>
        </div>
      </div>
    )
  }

  const DoctorCard:FC<{item:branchEmployee}> = ({item})=>{
    const [normalPrice, setNormalPrice] = useState(item.periods?(item.periods[0].normal_booking_price):0)
    const [urgentPrice, setUrgentPrice] = useState(item.periods?(item.periods[0].urgent_booking_price):0)
    const [followUpPrice  , setFollowUpPrice  ] = useState(item.periods?(item.periods[0].follow_up_booking_price):0)

    const [isStart, setisStart] = useState(true)
    useEffect(()=>{
      if(isStart)setisStart(false)
      else { 
        control.editPeriodPrices(item, normalPrice, urgentPrice,followUpPrice)    

      }
    },[normalPrice,urgentPrice,followUpPrice])


    return(
      <Col lg={12} className=' px-0 py-2'>
      <div className='p-md-2 border rounded-2'>
        <div className='d-flex justify-content-between p-md-3 p-1'>
          <div className='fs-5'>{item.employee?.name} - {item.employee?.specialization?.specialization}</div>
          <div className='px-md-5'></div>
          <div className='material-symbols-outlined btn-delete c-pointer fs-5 my-auto' onClick={()=>{
              Globals.popup.open({
                content:<div className='d-flex flex-column h-100'>
                  <div className='d-flex flex-column justify-content-center h-100'>
                    <div>هل تريد حذف الموظف .. {item.employee?.name}</div>
                    <div>ملاحظة مهمة ... سيتم حذف جميع المواعيد و الحجوزات المرتبطة بهذا الطبيب من هذا الفرع</div>
                  </div>
                  <div className='d-flex justify-content-center'>
                    <div className=' button-I btn-clr-II px-3 py-1 c-pointer' onClick={()=>{ control.removeEmployee(item.employee as UserProfile); Globals.popup.close()} } >موافق</div>
                  </div>
                </div>  
              })
            }}>
            close
          </div>
        </div>
        <div className='p-2'>
          <div className='row g-2 justify-content-around border pb-4' style={{ background:'rgba(253,253,253)' }}>
            <div className='col-md-4 col-12'>
              <FollowUpNo item={item}/>
            </div>
            <div className='col-md-4 col-12'>
              <FollowUpWeeks item={item}/>
            </div>
            <div className='col-md-4 col-12'>
              <Duration item={item}/>
            </div>
            <div className='col-md-4 col-12'>
              <div className='d-flex flex-column text-center justify-content-start   h-100'>
                <div className=' p-1 mx-auto'>
                  <div className='p-2 mx-auto '>
                    سعر الكشف العادي
                  </div>
                  <div className='w-100'>
                    <input type="text" className='input-field w-100' value={normalPrice}  onChange={a=>setNormalPrice(Number(a.target.value.replace(/[^0-9]/g, "")))} />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4 col-12'>
              <div className='d-flex flex-column text-center justify-content-start  h-100'>
                <div className=' p-1 mx-auto'>
                  <div className='p-2 mx-auto '>
                    سعر الكشف المستعجل
                  </div>
                  <div className='w-100'>
                    <input type="text" className='input-field w-100' value={urgentPrice}  onChange={a=>setUrgentPrice(Number(a.target.value.replace(/[^0-9]/g, "")))} />
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4 col-12'>
              <div className='d-flex flex-column text-center justify-content-start   h-100'>
                <div className=' p-1 mx-auto'>
                  <div className='p-2 mx-auto '>
                    سعر الاستشارة
                  </div>
                  <div className='w-100'>
                    <input type="text" className='input-field w-100' value={followUpPrice}  onChange={a=>setFollowUpPrice(Number(a.target.value.replace(/[^0-9]/g, "")))} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='pt-4 pb-2'>
          <div className='py-3 d-flex flex-wrap'>
          {
            item.periods?.map((period,index)=>(<Period period={period} index={index} user={item.employee as UserProfile}/>)
            )
          }
          </div>
          <div className='d-flex color-I c-pointer' onClick={()=>{
            Globals.popup.open({
              content:<AddPeriod employee={item.employee as UserProfile} normal={normalPrice} urgent={urgentPrice} followUp={followUpPrice}/>
            })
          }}>
            <div className='material-symbols-outlined my-auto'>add</div>
            <div className=' my-auto'>
              اضافة موعد/فترة 
            </div>
          </div>
        </div>
      </div>
    </Col>)
  }

  return (
    <Container className='py-5'>
      {
        control.Show(
          <Row className='p-0 m-0'>
            <Row className='p-0 m-0'>
            <h3 className='text-center fw-bold color-II'>بيانات الفرع</h3>
              <Col className='px-lg-4 px-md-2 py-3' lg={6}>
                {
                  control.editing?(
                    <div className='w-100 d-flex justify-content-center'>
                      <input className='w-100 input-field text-center' 
                        type="text" 
                        value={control.data.name} 
                        onChange={a=>control.Name = a.target.value} 
                        placeholder='اسم الفرع'  
                      />
                    </div>
                  ):(<div>{control.data.name}</div>)
                }
              </Col>
              <Col className='px-lg-4 px-md-2 py-3' lg={6}>
                {
                  control.editing?(
                    <div className='w-100 d-flex justify-content-center'>
                      <input className='w-100 input-field text-center' 
                        type="text" 
                        value={control.data.address} 
                        onChange={a=>control.Address = a.target.value} 
                        placeholder='العنوان'  
                      />
                    </div>
                  ):(<div>{control.data.address}</div>)
                }
              </Col>
              <Col className='px-lg-4 px-md-2 py-3' lg={6}>
                {
                  control.editing?(
                    <div className='w-100 d-flex justify-content-center'>
                      <input 
                        className='w-100 input-field text-center' 
                        onChange={a=>control.Mobile = a.target.value.replace(/[^0-9]/g, "")}
                        value={control.data.mobile}
                        placeholder='رقم الارضى'  
                      />
                    </div>
                  ):(<div>{control.data.mobile}</div>)
                }
              </Col>
              <Col className='px-lg-4 px-md-2 py-3' lg={6}>
                {
                  control.editing?(
                    <div className='w-100 d-flex justify-content-center'>
                      <input 
                        className='w-100 input-field text-center' 
                        onChange={a=>control.Whatsapp = GeneralMethods.mobileNumberInput(a.target.value)}
                        value={control.data.whatsapp}
                        placeholder='رقم الواتس و الموبايل'  
                      />
                    </div>
                  ):(<div>{control.data.whatsapp}</div>)
                }
              </Col>
              <Col className='px-lg-4 px-md-2 py-3' lg={6}>
                {
                  control.editing?(
                    <div className='w-100 d-flex justify-content-center'>
                      <input 
                        className='w-100 input-field text-center' 
                        onChange={a=>control.Email = a.target.value}
                        value={control.data.email}
                        placeholder='الايميل'  
                      />
                    </div>
                  ):(<div>{control.data.email}</div>)
                }
              </Col>

                {
                  control.editing?(
                  <Col className='px-lg-4 px-md-2 py-3' lg={6}>
                    <div className='w-100 d-flex justify-content-center'>
                      <input className='w-100 input-field text-center c-pointer' 
                        type="text" 
                        value={control.data.location} 
                        onChange={a=>control.Location = a.target.value} 
                        placeholder='رابط الموقع على خرائط جوجل'  
                        onFocus={handleFocus}
                      />
                    </div>
                  </Col>
                  ):(null)
                }
                {
                  control.data.location?(
                    <Col className='px-lg-4 px-md-2 py-3 overflow-hidden' lg={6}  style={{ height:'200px' }} >
                      <div className='d-flex flex-column justify-content-center h-100 w-100'>
                        <div className='w-100 d-flex flex-column justify-content-center h-100 overflow-hidden'  dangerouslySetInnerHTML={{ __html: control.data.location  }}>

                        </div>
                      </div>

                    </Col>
                  ):(null)
                }
            </Row>
            <Row className='px-lg-4 px-md-2 py-5'>
              <div className='d-flex p-0'>
                <div className='p-0'>
                  <Additional vm={control}></Additional>
                </div>
              </div>

              {
                control.data.employees?.filter(a=>a.employee?.role_id==null)?.length?(
                  <Row className='px-lg-4 px-md-2 py-3'>
                    <div>
                      <h5 className='p-2'>بلا وظيفة</h5>
                      <div className='border rounded-1 p-3 d-flex flex-wrap'>
                      {
                        control.data.employees?.filter(a=>a.employee?.role_id==null)?.map((item,index)=>(
                          <div className='d-flex px-3 py-1 border rounded-5'>
                            <div>{item.employee?.name}</div>
                            <div className='px-md-5 px-2'></div>
                            <div 
                                className='material-symbols-outlined btn-delete c-pointer fs-5 my-auto' 
                                onClick={
                                  ()=>{
                                    Globals.popup.open({
                                      content:
                                      <div className='d-flex flex-column h-100'>
                                        <div className='d-flex flex-column justify-content-center h-100'>
                                          <span>هل تريد حذف الموظف .. {item.employee?.name}</span>
                                        </div>
                                        <div className='d-flex justify-content-center '>
                                          <div className='button-I btn-clr-II px-3 py-1 c-pointer' onClick={()=>{
                                            Globals.popup.close()
                                            control.removeEmployee(item.employee as UserProfile)
                                            }}>موافق</div>
                                        </div>
                                      </div>
                                    })
                                  }
                                }>
                              close
                            </div>
                          </div>
                        ))
                      }
                      </div>
                    </div>
                  </Row>
                ):(null)
              }
              {
                control.rolesList?.filter(a=>a.id!="1").map((role,ind)=>(    
                  <Row className='px-lg-4 px-md-2 py-3'>
                    <div>
                      <h5>{role.role}</h5>
                      <div className='border rounded-1 p-3 d-flex flex-wrap'>
                      {
                        control.data.employees?.filter(a=>a.employee?.role_id==role.id)?.map((item,index)=>(
                          <div className='d-flex px-3 py-1 border rounded-5'>
                            <div>{item.employee?.name}</div>
                            <div className='px-md-5 px-2' ></div>
                            <div className='material-symbols-outlined btn-delete c-pointer fs-5 my-auto' onClick={()=>{
                                Globals.popup.open({
                                  content:
                                  <div className='d-flex flex-column h-100'>
                                    <div className='d-flex flex-column justify-content-center h-100'>
                                      <span>هل تريد حذف الموظف .. {item.employee?.name}</span>
                                    </div>
                                    <div className='d-flex justify-content-center '>
                                      <div className='button-I btn-clr-II px-3 py-1 c-pointer' onClick={()=>
                                        { 
                                          Globals.popup.close()
                                          control.removeEmployee(item.employee as UserProfile)
                                        }}>موافق</div>
                                    </div>
                                  </div>
                                })
                              }}>
                              close
                            </div>
                          </div>
                        ))
                      }
                      </div>
                    </div>
                  </Row>
                ))
              }
              {
                control.rolesList?.filter(a=>a.id=="1")?.length?(
                  <Row className='px-lg-4 px-md-2 p-0 py-3'>
                      <div className='p-0'>
                        <Row className=' rounded-1 p-0 d-flex flex-wrap'>
                        {
                          control.data.employees?.filter(a=>a.employee?.role_id=="1")?.map((item,index)=>(
                            <DoctorCard item={item}/>
                          ))
                        }
                        </Row>
                      </div>
                  </Row>
                ):(null)
              }
            </Row>
            <div className='d-flex justify-content-center'>
              <button className=' button-I btn-clr-II px-5 py-1' onClick={()=>control.send()}>حفظ</button>
            </div>
              
          </Row>
        )

      }
    </Container>
  )
}

export default CreateBranchPage


export class EditableBranchPageVM extends EditablePageVM<branch>{
  
  private _employeesList : UserProfile[] = [];
  public get employeesList() : UserProfile[]{
    return this._employeesList;
  }
  public set employeesList(v : UserProfile[]) {
    this._employeesList = v;
    this.update()
  }

  
  private _subServicesList : subService[] = [];
  public get subServicesList() : subService[] {
    return this._subServicesList;
  }
  public set subServicesList(v : subService[]) {
    this._subServicesList = v;
  }
  
  
  private _rolesList : Role[] = [];
  public get rolesList() : Role[] {
    return this._rolesList;
  }
  public set rolesList(v : Role[]) {
    this._rolesList = v;
    this.update()
  }
  

  public set Name(v:string){ this.data.name = v; this.update() }
  public set Mobile(v:string){ this.data.mobile = v; this.update() }
  public set Whatsapp(v:string){ this.data.whatsapp = v; this.update() }
  public set Email(v:string){ this.data.email = v; this.update() }
  public set Address(v:string){ this.data.address = v; this.update() }
  public set Location(v:string){ this.data.location = v; this.update() }

  constructor(){
      let init:branch = {name:'' , address:''}
      super(init ,BranchClient)
  }

  public async preInitiate(): Promise<void> {
    let response = await new EmployeeClient().getAll()
    if(response){
      this._employeesList = response
    }
    let subservices = await new SubServiceClient().getAll()
    if(subservices){
      this._subServicesList = subservices
    }
  }

  public async afterInitiate(): Promise<void> {
    await this.updateRoles()
  }

  private updateRoles(){
    let list:Role[] = []
    this.data.employees?.map(a=>{ 
      if(a.employee && a.employee.role_id){
        if(list.length>0){ 
          if(!list.some(e=>e.id==a.employee?.role_id)){
            list.push(a.employee?.role as Role) 
          }
        }else {
          if(a.employee?.role)list.push(a.employee?.role as Role) 
        }
      }
    })
    this.rolesList = [...list]
  }

  public addEmployee(item:UserProfile, periods?:period[]){
    this.data.employees = [...this.data.employees??[],
      {
        employee:item,
        employee_id:item.id,
        no_follow_ups:'',
        follow_up_weeks:'',
        duration:'00:00',
        periods:periods??[]
      }
    ]
    this.updateRoles()
    this.update()
  }

  public removeEmployee(item:UserProfile){
    Globals.popup.close()
    this.data.employees = this.data.employees?.filter(a=>a.employee_id!=item.id)
    this.updateRoles()
    this.update()
  }

  public addEmployeePeriod(item:UserProfile , period:period){
    this.data.employees = this.data.employees?.map(a=>{if(a.employee?.id==item.id)a.periods?a.periods.push(period):a.periods=[period]; return a })
      this.update()
  }
  public removeEmployeePeriod(item:UserProfile,period:period){
    Globals.popup.close()
    this.data.employees = this.data.employees?.map(a=>{ if(a.employee?.id==item.id && a.periods && a.periods.length)a.periods = a.periods.filter(b=>(b!=period));return a  })
      this.update()
  }

  public editEmployeePeriod(item:UserProfile , period:period){
    this.data.employees = this.data.employees?.map(a=>{if(a.employee?.id==item.id)a.periods?(a.periods = a.periods.map(b=>period===b?period:b)):a.periods=[period]; return a })

  }
  public editPeriodPrices(item:branchEmployee , normal:number , urgent:number , followUp:number){
    this._data.employees = this.data.employees?.map(a=>{if(a==item)a.periods?.map(p=>{p.normal_booking_price=normal;p.urgent_booking_price=urgent;p.follow_up_booking_price=followUp; return p;} ); return a })

  }

  public editEmployee(item:branchEmployee){
    this.data.employees = this.data.employees?.map(a=>a==item?item:a)

  }
}

