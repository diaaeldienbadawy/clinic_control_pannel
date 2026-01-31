import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom';
import { navigator } from '../../MyLib/Components/Facilities';
import { Col, Container, Row } from 'react-bootstrap';
import SpecializationsPage from '../HR/SpecializationsPage';
import RolesPage from '../HR/RolesPage';
import { EmployeesPage } from '../HR/EmployeesPage';
import CreateEmployee from '../HR/CreateEmployee';
import { BookingsPage } from './BookingsPage';
import { ServiceBookingsPage } from './ServiceBookingsPage';

const ManagementPage = () => {
    const location = useLocation();
    useEffect(()=>{
      if(location.pathname =='/' || location.pathname =='/management') navigator.Bookings()
    },[])
  
  return (
    <>
      {/* <Row className='justify-content-center'>
        <Col lg={10} className='p-0'>
          <div className='row g-2 py-3'>
            <div className=' col-sm-auto col-12'>
                <button className={`button-I w-100 ${location.pathname=='/management/bookings'?'btn-clr-II':''} px-sm-4 py-sm-1 fs-5`} onClick={navigator.Bookings}>الكشوفات</button>
            </div>
            <div className=' col-sm-auto col-12 '>
                <button className={`button-I  w-100 ${location.pathname=='/management/service-bookings'?'btn-clr-II':''} px-sm-4 py-sm-1 fs-5`} onClick={navigator.Servicebookings}>الخدمات</button>
            </div>
          </div>
        </Col>
      </Row> */}

        <Routes>
          <Route path='/bookings' element={<BookingsPage/>}></Route>
          {/* <Route path='/service-bookings' element={<ServiceBookingsPage/>}></Route> */}
        </Routes>

    </>
  )
}

export default ManagementPage
