import React, { useEffect } from 'react'
import { PaginatedListVM } from '../../MyLib/Structure/ViewModels/Abstracts/ListVM'
import { event } from '../../Structure/Models/event'
import { EventClient } from '../../Structure/Api/Clients/EventClient'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Col, Container, Row } from 'react-bootstrap'
import Pagination from '../../Components/Utilities/Pagination'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import Event from './Event'
import CreateEvent from './CreateEvent'
import { useLocation } from 'react-router-dom'

export const EventsPage = () => {
  const control = useVM<EventsPageVM>(new EventsPageVM())
  const location = useLocation()
  useEffect(()=>{ control.initiate(Number(new URLSearchParams(location?.search).get('page')??1)) },[])
  return (
    <>{
      control.Show(
    <Container className='d-flex flex-column justify-content-between' style={{ minHeight:'100%' }}>
      <div className='d-flex flex-column justify-content-start h-100'>
              <h3 className='text-center py-5 fw-bold color-II'>المناسبات</h3>

              <Row className='justify-content-center'>
                <Col lg={10}>
                <div className='py-3'>
                  <button className='button-I btn-clr-II px-5 py-1 fs-4' onClick={()=>Globals.popup.open({title:'اضافة مناسبة', content:<CreateEvent list={control}/>})}>اضافة مناسبة</button>
                </div>
                {
                  control.Data && control.Data.data?(control.Data.data.map((item,index)=>(
                    <Event key={index} item={item} list={control} />
                  ))):null
                }
                </Col>
              </Row>
      </div>
      <div>
          <Pagination pagesCount={control.Data?.pagination.total_pages} initial={0} onPageChange={(page)=>{ control.getPage(Number(page)) }  }/>
        </div>
    </Container>
      )} </>
  )
}


export class EventsPageVM extends PaginatedListVM<event>{
  constructor(){
    super(EventClient , true)
  }
}