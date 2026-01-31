import React, { useEffect } from 'react'
import { InterActive, useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure';
import { IPaginatedResponse } from '../../MyLib/Structure/Interfaces/ResponsesData';
import { service } from '../../Structure/Models/service';
import { ServiceClient } from '../../Structure/Api/Clients/ServiceClient';
import { Col, Container, Row } from 'react-bootstrap';
import { navigator } from '../../MyLib/Components/Facilities';
import Pagination from '../../Components/Utilities/Pagination';
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs';
import { useLocation } from 'react-router-dom';

export const ServicesPage = () => {
    const control = useVM<ServicesPageVM>(new ServicesPageVM())
  const location = useLocation()
  useEffect(()=>{
    control.getData(Number(new URLSearchParams(location?.search).get('page')??1))
  },[])
  return (
    <>
      {control.Show(
    <Container className='py-5 d-flex flex-column justify-content-between ' style={{ minHeight:'100%' }}>
      <Row className=''>
        <Col className='mx-auto h-100' md={10}>
          <h3 className='text-center fw-bold color-II'>الخدمات</h3>
          
          <Row className='m-0 px-0 py-5'>
            <div>
              <button className='button-I btn-clr-II px-5  fs-3 py-1' onClick={()=>navigator.CreateService()}>اضافة خدمة</button>
            </div>
          {
              control.Data && control.Data.data?(control.Data?.data.map((item,index)=>(
                <Col className='py-3' key={index} md={6} xl={4}>
                  <div className='artical-card mx-auto h-100'>
                    <div className='ratio ratio-16x9' onClick={()=>navigator.CreateService(item.slug)}>
                      <img className='w-100 ratio ratio-16x9' src={item.service_img as string??'assets/images/empty.png'} alt="" />
                    </div>
                    <div className='h-100 p-2'>
                      <div className='d-flex justify-content-between'>
                        <h4 className='fw-bold' onClick={()=>navigator.CreateService(item.slug)}>{item.title}</h4>
                        <div className='d-flex'>
                          <div className='px-2 btn-clr-save c-pointer material-symbols-outlined' onClick={()=>navigator.CreateService(item.slug)}>edit</div>
                          <div className='px-2 btn-delete c-pointer z-3 material-symbols-outlined' onClick={()=>
                            Globals.popup.open({
                              title:'تنبيه',
                              content:
                              <div className='d-flex flex-column justify-content-between h-100'>
                                <div className='d-flex flex-column h-100 justify-content-center'>
                                  هل تريد حذف الخدمة ؟ 
                                </div>
                                <div className='d-flex justify-content-center'>
                                  <div className='button-I btn-clr-II px-3 py-1 c-pointer'
                                    onClick={()=>{
                                      Globals.popup.close()
                                      control.delete(item)
                                    }}
                                  >موافق</div>
                                </div>
                              </div>
                            })
                            }>delete</div>
                        </div>
                      </div>
                      
                      <p>{item.prief}</p>
                    </div>
                  </div>
                </Col>
              ))):null
          }
          </Row>
        </Col>

      </Row>
      <div>
          <Pagination pagesCount={control.Data?.pagination?.total_pages} initial={0} onPageChange={(page)=>{ control.getData(Number(page)) }  }/>
        </div>
    </Container>)}</>
  )
}

export class ServicesPageVM extends InterActive{
    private data?: IPaginatedResponse<service>;
    public get Data():IPaginatedResponse<service>|undefined{ return this.data  }
    public set Data(value:IPaginatedResponse<service>|undefined){ this.data = value ; this.update()  }

    private currentPage:number = 0;
    public get CurrentPage():number{ return this.currentPage  }
    public set CurrentPage(value:number){ this.currentPage = value ; this.update()  }

    public getData(page?:number){
        this.loading(async()=>{
            const response = await new ServiceClient().getPage(page)
            if(response){
                this.data = response
                this.currentPage = page??1
                this.update()
            }
        })
    }
    public async delete(item:service){
        const response = await new ServiceClient().delete(item.id??'' , {onSuccess:()=>this.getData(this.currentPage)})
    }
}
