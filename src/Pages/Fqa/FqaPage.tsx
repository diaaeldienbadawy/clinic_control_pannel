import React, { useEffect } from 'react'
import { ListVM, PaginatedListVM } from '../../MyLib/Structure/ViewModels/Abstracts/ListVM'
import { fqa } from '../../Structure/Models/fqa'
import { FqaClient } from '../../Structure/Api/Clients/FqaClient'
import { Col, Container, Row } from 'react-bootstrap'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import Pagination from '../../Components/Utilities/Pagination'
import Question from './Question'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import CreateQuestion from './CreateQuestion'
import { useLocation } from 'react-router-dom'

export const FqaPage = () => {
  const control = useVM<FqaPageVM>(new FqaPageVM())
  const location = useLocation()
  useEffect(()=>{ control.initiate(Number(new URLSearchParams(location?.search).get('page')??1)) },[])
  return (<>{
    control.Show(
      <div className='d-flex flex-column justify-content-between' style={{ minHeight:'100%' }}>
      <div className='d-flex flex-column' >
  

              <h3 className='text-center py-5 fw-bold color-II'>الاسئلة الشائعة</h3>

              <Row className='justify-content-center'>
                <Col lg={10}>
                <div className=' pb-4'>
                  <button className='button-I btn-clr-II px-5 py-1' onClick={()=>Globals.popup.open({title:'اضافة سؤال', content:<CreateQuestion list={control}/>})}>اضافة سؤال</button>
                </div>
                {
                  control.Data && control.Data.data?control.Data.data.map((item,index)=>(
                    <Question key={index} item={item} list={control} />
                  )):null
                }
                </Col>
              </Row>
           
        

      </div>
      <div>
          <Pagination pagesCount={control.Data?.pagination?.total_pages} initial={0} onPageChange={(page)=>{ control.getPage(Number(page)) }  }/>
        </div>
    </div>

          )}</>
  )
}

export class FqaPageVM extends PaginatedListVM<fqa>{
  constructor(){
    super(FqaClient , true)
  }
}