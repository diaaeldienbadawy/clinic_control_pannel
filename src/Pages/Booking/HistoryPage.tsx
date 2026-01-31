import  { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import { navigator } from '../../MyLib/Components/Facilities';
import { Col, Container, Row } from 'react-bootstrap';
import { BookingsPage } from './BookingsPage';
import { ServiceBookingsPage } from './ServiceBookingsPage';
import { BookingsPageHistory } from './BookingsPageHistory';
import { ServiceBookingsPageHistory } from './ServiceBookingsPageHistory';

const HistoryPage = () => {
    const location = useLocation();
    useEffect(()=>{
      if(location.pathname =='/' || location.pathname =='/history') navigator.BookingHistorys()
    },[])
  
  return (
    <Container className='py-3 h-100 d-flex flex-column'>
      {/* <Row className='justify-content-center'>
        <Col lg={10} className='p-0'>
            <div className='row g-2 py-3'>
              <div className=' col-sm-auto col-12'>
                  <button className={`button-I w-100 ${location.pathname=='/history/bookings'?'btn-clr-II':''} px-sm-4 py-sm-1 fs-5`} onClick={navigator.BookingHistorys}>الكشوفات</button>
              </div>
              <div className=' col-sm-auto col-12 '>
                  <button className={`button-I  w-100 ${location.pathname=='/history/service-bookings'?'btn-clr-II':''} px-sm-4 py-sm-1 fs-5`} onClick={navigator.ServicebookingHistorys}>الخدمات</button>
              </div>
            </div>
        </Col>
      </Row> */}
      <div className='' style={{ minHeight:'90%' }}>
        <Routes>
          <Route path='/bookings' element={<BookingsPageHistory/>}></Route>
          {/* <Route path='/service-bookings' element={<ServiceBookingsPageHistory/>}></Route> */}
        </Routes>
      </div>
    </Container>
  )
}

export default HistoryPage
