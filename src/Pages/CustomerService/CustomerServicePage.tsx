import React, { useEffect } from 'react'
import { EditablePageVM } from '../../MyLib/Structure/ViewModels/Abstracts/EditablePageVM'
import { customerService } from '../../Structure/Models/customerService'
import { CustomerServiceClient } from '../../Structure/Api/Clients/CustomerServiceClient'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Col, Container, Row } from 'react-bootstrap'
import CustomPhoneInput from '../../MyLib/Components/CustomPhoneInput'

export const CustomerServicePage = () => {
  const control = useVM<CustomerServicePageVM>(new CustomerServicePageVM())
  useEffect(()=>{ control.initiate() },[])
  return (
    <Container className='h-100'>
      <Row className=' justify-content-center h-100'>
        {
          control.Show(
            <Col  md={10} lg={6} className='d-flex flex-column justify-content-center text-center' style={{ direction:'ltr' }}>
              <div className='py-4'>
                <div className='py-1'>
                  <label htmlFor="">رقم الموبايل</label>
                </div>
                <div className='d-flex justify-content-center m-auto' style={{ maxWidth:'280px' }}>
                  <input className='input-field w-100' value={control.data.mobile} onChange={a=>control.Mobile=a.target.value} />
                </div>
              </div>
              <div className='py-4'>
                <div className='py-1'>
                  <label htmlFor="">رقم الواتساب</label>
                </div>
                <div className='d-flex justify-content-center m-auto' style={{ maxWidth:'280px' }}>
                  <CustomPhoneInput className='input-field w-100' value={control.data.whatsapp} setFullNumber={a=>control.Whatsapp=a} />
                </div>
              </div>
              <div className='py-4'>
                <div className='py-1'>
                  <label htmlFor="">صفحة الفيسبوك</label>
                </div>
                <div className='d-flex justify-content-center m-auto' style={{ maxWidth:'280px' }}>
                  <input type='url' className='input-field w-100' value={control.data.facebook} onChange={a=>control.Facebook=a.target.value} />
                </div>
              </div>
              <div className='py-4'>
                <div className='py-1'>
                  <label htmlFor="">صفحة الانستجرام</label>
                </div>
                <div className='d-flex justify-content-center m-auto' style={{ maxWidth:'280px' }}>
                  <input type='url' className='input-field w-100' value={control.data.instegram} onChange={a=>control.Instegram=a.target.value} />
                </div>
              </div>
              <div className='py-4'>
                <div className='py-1'>
                  <label htmlFor="">قناة اليوتيوب</label>
                </div>
                <div className='d-flex justify-content-center m-auto' style={{ maxWidth:'280px' }}>
                  <input type='url' className='input-field w-100' value={control.data.youtube} onChange={a=>control.Youtube=a.target.value} />
                </div>
              </div>
              <div className='py-4'>
                <div className='py-1'>
                  <label htmlFor="">الايميل</label>
                </div>
                <div className='d-flex justify-content-center m-auto' style={{ maxWidth:'280px' }}>
                  <input type='email' className='input-field w-100' value={control.data.email} onChange={a=>control.Email=a.target.value} />
                </div>
              </div>
              <div className='py-2'>
                <button className='button-I btn-clr-II c-pointer px-5 py-1'
                  onClick={()=>{
                    control.send()
                  }}
                
                >حفظ</button>
              </div>
            </Col>
          )
        }
      </Row>
    </Container>
  )
}

export class CustomerServicePageVM extends EditablePageVM<customerService>{
  
  constructor(){
    super({mobile:'' } , CustomerServiceClient)
    this.id = '1' 
  }
  
  public async preInitiate(): Promise<void> {
    
  }
  public async afterInitiate(): Promise<void> {
    
  }

  public set Mobile(v:string){ this._data.mobile = v; this.update() }
  public set Whatsapp(v:string){ this._data.whatsapp = v; this.update() }
  public set Facebook(v:string){ this._data.facebook = v; this.update() }
  public set Instegram(v:string){ this._data.instegram = v; this.update() }
  public set Youtube(v:string){ this._data.youtube = v; this.update() }
  public set Email(v:string){ this._data.email = v; this.update() }
}
