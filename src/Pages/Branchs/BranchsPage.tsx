import React, { useEffect } from 'react'
import { InterActive, useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure';
import { IPaginatedResponse } from '../../MyLib/Structure/Interfaces/ResponsesData';
import { branch } from '../../Structure/Models/branch';
import { BranchClient } from '../../Structure/Api/Clients/BranchClient';
import { Col, Container, Row } from 'react-bootstrap';
import { navigator } from '../../MyLib/Components/Facilities';
import Pagination from '../../Components/Utilities/Pagination';
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs';
import { useLocation } from 'react-router-dom';

const BranchsPage = () => {
  const control = useVM<BranchsPageVM>(new BranchsPageVM())
  const location = useLocation()
  useEffect(()=>{
    control.getData(Number(new URLSearchParams(location?.search).get('page')??1))
  },[])

  return (
    <>
    {                
    control.Show(
    <Container className='py-5 d-flex flex-column justify-content-between' style={{ minHeight:'100%' }}>
      <div className='d-flex flex-column justify-content-between h-100'>
        
        <div>
          <h3 className='text-center fw-bold color-II'>الفروع</h3>

          <Row className='py-5 justify-content-center'>
            <Col className='p-0 m-0' md={10}>
              <div>
                <button className='button-I btn-clr-II px-5 py-1 fs-3' onClick={()=>navigator.CreateBranch()}>اضافة فرع</button>
              </div>
              <Row className='px-0 mx-0'>
              {
                  control.Data && control.Data.data?(control.Data.data.map((item,index)=>(
                    <Col className='py-3' key={index} md={6} xl={4}>
                      <div className='artical-card border mx-auto h-100'>
                        <div className='h-100 p-2'>
                          <div className='d-flex justify-content-between'>
                            <h4 className='fw-bold c-pointer' onClick={()=>navigator.CreateBranch(item.id)}>{item.name}</h4>
                            <div className='d-flex'>
                              <div className='px-2 btn-clr-save c-pointer material-symbols-outlined' onClick={()=>navigator.CreateBranch(item.id)}>edit</div>
                              <div className='px-2 btn-delete c-pointer z-3 material-symbols-outlined' onClick={()=>
                                Globals.popup.open({
                                  content:
                                  <div className='d-flex flex-column justify-content-between h-100'>
                                    <div className='d-flex flex-column h-100'>
                                      هل تريد حذف فرع {item.name} ؟
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
                                })}>delete</div>
                            </div>
                          </div>

                          <p>{item.address}</p>
                        </div>
                      </div>
                    </Col>
                  ))):null
              }
              </Row>
            </Col>
          </Row>
        </div>

      </div>
      <div>
          <Pagination pagesCount={control.Data?.pagination?.total_pages} initial={0} onPageChange={(page)=>{ control.getData(Number(page)) }  }/>
        </div>
    </Container>)} 
    </>
  )
}

export default BranchsPage


export class BranchsPageVM extends InterActive{
    private data?: IPaginatedResponse<branch>;
    public get Data():IPaginatedResponse<branch>|undefined{ return this.data  }
    public set Data(value:IPaginatedResponse<branch>|undefined){ this.data = value ; this.update()  }

    private currentPage:number = 0;
    public get CurrentPage():number{ return this.currentPage  }
    public set CurrentPage(value:number){ this.currentPage = value ; this.update()  }

    public getData(page?:number){
        this.loading(async()=>{
            const response = await new BranchClient().getPage(page)
            if(response){
                this.data = response
                this.currentPage = page??1
                this.update()
            }
        })
    }
    public async delete(item:branch){
        const response = await new BranchClient().delete(item.id??'' , {onSuccess:()=>this.getData(this.currentPage)})
    }
}