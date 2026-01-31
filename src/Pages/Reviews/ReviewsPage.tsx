import React, { useEffect } from 'react'
import { PaginatedListVM } from '../../MyLib/Structure/ViewModels/Abstracts/ListVM'
import { event } from '../../Structure/Models/event'
import { EventClient } from '../../Structure/Api/Clients/EventClient'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Col, Container, Row } from 'react-bootstrap'
import Pagination from '../../Components/Utilities/Pagination'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { useLocation } from 'react-router-dom'
import { review } from '../../Structure/Models/review'
import { ReviewClient } from '../../Structure/Api/Clients/ReviewClient'
import Review from './Review'
import CreateReview from './CreateReview'

export const ReviewsPage = () => {
  const control = useVM<ReviewsPageVM>(new ReviewsPageVM())
  const location = useLocation()
  useEffect(()=>{ control.initiate(Number(new URLSearchParams(location?.search).get('page')??1)) },[])
  return (
    <>{
      control.Show(
    <Container className='d-flex flex-column justify-content-between' style={{ minHeight:'100%' }}>
      <div className='d-flex flex-column justify-content-start h-100'>
        <h3 className='text-center pt-5 fw-bold color-II'>الاراء</h3>
        <div className='py-3'>
            <button className='button-I btn-clr-II px-5 py-1 fs-4' onClick={()=>Globals.popup.open({title:'اضافة مناسبة', content:<CreateReview list={control}/>})}>اضافة رأي</button>
        </div>
        <Row className='justify-content-center'>
          

          {
            control.Data && control.Data.data?(control.Data.data.map((item,index)=>(
              <Col xl={4} md={6}>
                <Review key={index} item={item} list={control} />
              </Col>
            ))):null
          }
          
        </Row>
      </div>
      <div>
          <Pagination pagesCount={control.Data?.pagination.total_pages} initial={0} onPageChange={(page)=>{ control.getPage(Number(page)) }  }/>
      </div>
    </Container>
      )} </>
  )
}


export class ReviewsPageVM extends PaginatedListVM<review>{
  constructor(){
    super(ReviewClient , true)
  }
}