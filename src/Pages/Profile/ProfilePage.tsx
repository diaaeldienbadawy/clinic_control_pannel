import React, { ReactElement, useEffect, useState } from 'react'
import { profile } from '../../Structure/Models/profile'
import { ProfileClient } from '../../Structure/Api/Clients/ProfileClient'
import { EditablePageVM } from '../../MyLib/Structure/ViewModels/Abstracts/EditablePageVM'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Col, Container, Row } from 'react-bootstrap'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import CustomPhoneInput from '../../MyLib/Components/CustomPhoneInput'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import CreateProfileCertificate from './CreateProfileCertificate'
import { profileCertificate } from '../../Structure/Models/profileCertificate'
import ProfileCertificate from './ProfileCertificate'
import { profileExperience } from '../../Structure/Models/profileExperience'
import CreateProfileExperience from './CreateProfileExperience'
import { profileResearch } from '../../Structure/Models/profileResearch'
import CreateProfileResearch from './CreateProfileResearch'

export const ProfilePage = () => {
  const control = useVM<ProfilePageVM>(new ProfilePageVM())
  useEffect(()=>{ control.initiate() },[])


    const Certificates = ()=>{
      return(
        <>
        {
          control.data.profile_certificates?.map((item,index)=>(
          <div className='p-5 d-flex ratio ratio-16x9' style={{width:'300px'}}>
              <CustomImageUpload 
                  value={item.profile_cerificate_image} 
                  onSelect={a=>{ 

                      item.profile_cerificate_image=a
                      control.editCeritificate(item)
                   }} ratio='16x9'/>
            </div>
          ))
        }
        </>
      )
    }

    const Experiences = ()=>{
      return(
        <>
        {
          control.data.profile_experiences?.map((item,index)=>{
            const Experience = ()=>{
              const [place, setPlace] = useState(item.place)
              const [jobTitle, seTjobTitle] = useState(item.job_title)

              return (
              <div className='p-2 d-flex ' >
                <div className='w-100'>
                  <div className='d-flex p-1'>
                    <input 
                      type="text" 
                      className='input-field' 
                      placeholder='مكان العمل'
                      value={place} 
                      onChange={
                        a=>{
                          setPlace(a.target.value)
                          item.place = a.target.value
                          control.data.profile_experiences = control.data.profile_experiences?.map(a=>a==item?item:a)
                        }
                      }
                    />
                  </div>
                  <div className='d-flex p-1'>
                    <input 
                      type="text" 
                      className='input-field' 
                      placeholder='المسمى الوظيفي'
                      value={jobTitle} 
                      onChange={
                        a=>{
                          seTjobTitle(a.target.value)
                          item.job_title = a.target.value
                          control.data.profile_experiences = control.data.profile_experiences?.map(a=>a==item?item:a)
                        }
                      }
                    />
                  </div>
                </div>
                <div className='material-symbols-outlined c-pointer btn-delete p-2 my-auto'
                  onClick={()=>{
                    Globals.popup.open({
                      title:'تنبيه',
                      content:
                      <div className='d-flex flex-column justify-content-between h-100'>
                        <div className='d-flex flex-column justify-content-center h-100'>
                          هل تريد حذف هذا العنصر ؟
                        </div>
                        <div className='d-flex justify-content-center'>
                          <button className='button-I btn-clr-II bg-danger px-3 py-1 c-pointer' onClick={()=>{
                            control.removeExperience(item)
                            Globals.popup.close()
                          }}>موافق</button>
                        </div>
                      </div>
                      
                    })

                  }}
                >
                  delete
                </div>
              </div>
              )
            }
            return <Experience/>
          }
          )
        }
        </>
      )
    }

    const Researchs = ()=>{
      return(
        <>
        {
          control.data.profile_researchs?.map((item,index)=>{
            const Research = ()=>{
              const [title, setTitle] = useState(item.title)
              const [date, setDate] = useState(item.date)
              const [inistitution, setInistitution] = useState(item.inistitution)
              const [description , setDescription] = useState(item.description)
              const [url, setUrl] = useState(item.url)
              return (
                <div className='p-2 d-flex ' >
                  <div className='w-100'>
                    <div className='d-flex p-1 w-100'>
                      <input 
                        type="text" 
                        className='input-field w-100' 
                        placeholder='عنوان البحث'
                        value={title} 
                        onChange={
                          a=>{
                            setTitle(a.target.value)
                            item.title = a.target.value
                            control.data.profile_researchs = control.data.profile_researchs?.map(b=>b==item?item:b)
                          }
                        }
                      />
                    </div>
                    <div className='p-1 d-flex'>
                      <div className='d-flex px-1 w-100'>
                        <input 
                          type="date" 
                          className='input-field w-100' 
                          value={date} 
                          onChange={
                            a=>{
                              setDate(a.target.value)
                              item.date = a.target.value
                              control.data.profile_researchs = control.data.profile_researchs?.map(a=>a==item?item:a)
                            }
                          }
                        />
                      </div>
                      <div className='d-flex px-1 w-100'>
                        <input 
                          type="text" 
                          className='input-field w-100' 
                          placeholder='جهة اصدار البحث'
                          value={inistitution} 
                          onChange={
                            a=>{
                              setInistitution(a.target.value)
                              item.inistitution = a.target.value
                              control.data.profile_researchs = control.data.profile_researchs?.map(a=>a==item?item:a)
                            }
                          }
                        />
                      </div>
                    </div>
                    <div className='d-flex p-1 w-100'>
                      <textarea 
                        style={{ resize:'none' }}
                        className='input-field w-100' 
                        placeholder='الوصف...'
                        value={description.replaceAll('</br>','\n')} 
                        onChange={
                          a=>{
                            setDescription(a.target.value)
                            item.description = a.target.value.replaceAll('\n','</br>')
                            control.data.profile_researchs = control.data.profile_researchs?.map(a=>a==item?item:a)
                          }
                        }
                      />
                    </div>
                    <div className='d-flex p-1 w-100'>
                      <input 
                        type="url" 
                        className='input-field w-100' 
                        placeholder='رابط البحث'
                        value={url} 
                        onChange={
                          a=>{
                            setUrl(a.target.value)
                            item.url = a.target.value
                            control.data.profile_researchs = control.data.profile_researchs?.map(a=>a==item?item:a)
                          }
                        }
                      />
                    </div>
                  </div>
                  <div className='material-symbols-outlined c-pointer btn-delete p-2 my-auto'
                    onClick={()=>{
                      Globals.popup.open({
                        title:'تنبيه',
                        content:
                        <div className='d-flex flex-column justify-content-between h-100'>
                          <div className='d-flex flex-column justify-content-center h-100'>
                            هل تريد حذف هذا العنصر ؟
                          </div>
                          <div className='d-flex justify-content-center'>
                            <button className='button-I btn-clr-II bg-danger px-3 py-1 c-pointer'
                              onClick={()=>{
                                control.removeResearch(item)
                                Globals.popup.close()
                              }}
                            >موافق</button>
                          </div>
                        </div>
                      })

                    }}
                  >
                    delete
                  </div>
                </div>
              )
            }
            return (<Research/>)  
          })
        }
        </>
      )
    }

  return (
    <Container className='py-5'>
      <h3 className='text-center py-5 fw-bold color-II'>السيرة الذاتية</h3>
      {
          control.Show(<>
      <Row>
        <Col className='h-auto'  lg={6} md={8} xl={4} style={{ height:'100%', minHeight:'200px', maxHeight:'450px'  }}>
          <div className='h-100'>
            <CustomImageUpload value={control.data.profile_img} onSelect={ a => control.ProfileImg = a } />
          </div>
        </Col>
        <Col className='px-5'  lg={6} md={4} xl={8} >
          <div className='py-2 d-flex w-100'>
            <input className='input-field w-100' type="text" value={control.data.name} onChange={a=>control.Name=a.target.value} placeholder='اسم الطبيب'/>
          </div>
          <div className='py-2 d-flex w-100'>
            <input className='input-field w-100' type="text" value={control.data.specialization} onChange={a=>control.Specialization=a.target.value} placeholder='التخصص'/>
          </div>
          <div className='py-2 d-flex w-100'>
            <input className='input-field w-100' type="text" value={control.data.job_title} onChange={a=>control.JobTitle=a.target.value} placeholder='المسمى الوظيفي'/>
          </div>
          <div className='py-2 d-flex w-100'>
            <input className='input-field w-100' type="text" value={control.data.university} onChange={a=>control.University=a.target.value}  placeholder='الجامعة و الدرجة العلمية'/>
          </div>
          <div className='py-2 d-flex w-100'>
            <CustomPhoneInput  className='input-field w-100' value={control.data.mobile} setFullNumber={a=>control.Mobile=a} placeholder='موبايل'/>
          </div>
          <div className='py-2 d-flex w-100'>
            <CustomPhoneInput  className='input-field w-100' value={control.data.whatsapp} setFullNumber={a=>control.Whatsapp=a} placeholder='واتساب'/>
          </div>
          <div className='py-2 d-flex w-100'>
            <input className='input-field w-100' type="text" value={control.data.email} onChange={a=>control.Email=a.target.value}  placeholder='الايميل'/>
          </div>
        </Col>
      </Row>
      <Row>
        <div className='p-5'>
          <textarea className='input-field w-100' rows={4} value={control.data.summery?.replaceAll('</br>','\n')} onChange={a=>control.Summery=a.target.value.replaceAll('\n','</br>')} placeholder={'نبذة مختصرة ...'} style={{ resize:'none' }}></textarea>
        </div>
      </Row>
      <Row className='py-5'>
        <h3>الشهادات</h3>
        <div className='d-flex'>
          <button className='button-I btn-clr-II px-5 py-1' onClick={()=>Globals.popup.open({
            title:'اضافة شهادة جديدة',
            content:<CreateProfileCertificate vm={control}/>
          })}>اضافة شهادة جديدة</button>
        </div>
        <Col className='d-flex flex-wrap justify-content-center'>
          <Certificates/>
        </Col>
      </Row>        
      <Row className='py-5'>
        <h3>الخبرات</h3>
        <div className='d-flex'>
          <button className='button-I btn-clr-II px-5 py-1' onClick={()=>Globals.popup.open({
            title:'اضافة  خبرة عملية جديدة',
            content:<CreateProfileExperience vm={control}/>
          })}>اضافة خبرة عملية جديدة</button>
        </div>
        <Col className='d-flex flex-wrap'>
          <Experiences/>
        </Col>
      </Row>   
      <Row className='py-5'>
        <h3>الابحاث</h3>
        <div className='d-flex'>
          <button className='button-I btn-clr-II px-5 py-1' onClick={()=>Globals.popup.open({
            title:'اضافة بحث جديد',
            content:<CreateProfileResearch vm={control}/>
          })}>اضافة بحث جديد</button>
        </div>
        <Col className='d-flex flex-wrap'>
          <Researchs/>
        </Col>
      </Row>   
      <div className='d-flex justify-content-center'>
          <button className='button-I btn-clr-II px-5 py-1' onClick={()=>control.send()}>حفظ</button>
      </div>
      </>)
        }
    </Container>
  )
}


export class ProfilePageVM extends EditablePageVM<profile>{
  constructor(){
    super({name:'' , profile_img:'' , profile_certificates:[] , profile_experiences:[] , profile_researchs:[]} , ProfileClient)
    this.id = '1'
  }
  public async preInitiate(): Promise<void> {
      
  }
  public async afterInitiate(): Promise<void> {
    
  }

  public set Name(v:string){ this.data.name = v; this.update() }
  public set ProfileImg(v:File|string){ this.data.profile_img = v; this.update() }
  public set Specialization(v:string){ this.data.specialization = v; this.update() }
  public set JobTitle(v:string){ this.data.job_title = v; this.update() }
  public set University(v:string){ this.data.university = v; this.update() }
  public set Mobile(v:string){ this.data.mobile = v; this.update() }
  public set Whatsapp(v:string){ this.data.whatsapp = v; this.update() }
  public set Email(v:string){ this.data.email = v; this.update() }
  public set Summery(v:string){ this.data.summery = v; this.update() }

  
  private _certificates : ReactElement = <></>;
  public get certificates() : ReactElement {
    return this._certificates;
  }
  public set certificates(v : ReactElement) {
    this._certificates = v;
    this.update()
  }
  
  //certificates
  public addCertificat(item:profileCertificate){
    if(this.data.profile_certificates){
      this.data.profile_certificates.push(item)
    }else {
      this.data.profile_certificates = [item]
    }
    this.update()
  }
  public editCeritificate(item:profileCertificate){
      if(this.data.profile_certificates){
        this.data.profile_certificates =[...this.data.profile_certificates.map((a)=>(a==item?item:a)).filter(a=>a.profile_cerificate_image!='')]
        this.update()
      }
  }
  public removeCertificate(item:profileCertificate){
      if(this.data.profile_certificates){
        this.data.profile_certificates = [...this.data.profile_certificates.filter((a)=>(a!==item))]
        this.update()
      }
  }

  //experiences
  public addExperience(item:profileExperience){
    if(this.data.profile_experiences){
      this.data.profile_experiences.push(item)
    }else {
      this.data.profile_experiences = [item]
    }
    this.update()
  }
  public editExperience(item:profileExperience){
      if(this.data.profile_experiences){
        this.data.profile_experiences =[...this.data.profile_experiences.map((a)=>(a==item?item:a))]
        this.update()
      }
  }
  public removeExperience(item:profileExperience){
      if(this.data.profile_experiences){
        this.data.profile_experiences = [...this.data.profile_experiences.filter((a)=>(a!==item))]
        this.update()
      }
  }

  //researchs
  public addResearch(item:profileResearch){
    if(this.data.profile_researchs){
      this.data.profile_researchs.push(item)
    }else {
      this.data.profile_researchs = [item]
    }
    this.update()
  }
  public editResearch(item:profileResearch){
      if(this.data.profile_researchs){
        this.data.profile_researchs =[...this.data.profile_researchs.map((a)=>(a==item?item:a))]
        this.update()
      }
  }
  public removeResearch(item:profileResearch){
      if(this.data.profile_researchs){
        this.data.profile_researchs = [...this.data.profile_researchs.filter((a)=>(a!==item))]
        this.update()
      }
  }

}