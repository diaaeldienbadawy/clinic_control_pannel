import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import SpecializationsPage from './SpecializationsPage'
import RolesPage from './RolesPage'
import { useNav } from '../../MyLib/Structure/CustomHock/useNav'
import { navigator } from '../../MyLib/Components/Facilities'
import { EmployeesPage } from './EmployeesPage'
import CreateEmployee from './CreateEmployee'

const HrManagementPage = () => {
    const location = useLocation();
    useEffect(()=>{
      if(location.pathname =='/hr') navigator.Specializations()
    },[])
    console.log(location.pathname)
  return (
    <Container className='py-3 d-flex flex-column h-100'>
      <div className='row g-2'>
        <div className=' col-sm-auto col-12'>
            <button className={`button-I w-100 ${location.pathname=='/hr/specializations'?'btn-clr-II':''} px-sm-4 py-sm-1 fs-5`} onClick={navigator.Specializations}>التخصصات</button>
        </div>
        <div className=' col-sm-auto col-12 '>
            <button className={`button-I  w-100 ${location.pathname=='/hr/roles'?'btn-clr-II':''} px-sm-4 py-sm-1 fs-5`} onClick={navigator.Roles}>الوظائف</button>
        </div>
        <div className=' col-sm-auto col-12'>
            <button className={`button-I w-100 ${location.pathname=='/hr/employees'?'btn-clr-II':''} px-sm-4 py-sm-1 fs-5`} onClick={navigator.Employees}>الموظفين</button>
        </div>
      </div>

        <Routes>
          <Route path='/specializations' element={<SpecializationsPage/>}></Route>
          <Route path='/roles' element={<RolesPage/>}></Route>
          <Route path='/employees' element={<EmployeesPage/>}></Route>
          <Route path='/employees/create/:id?' element={<CreateEmployee/>}></Route>
        </Routes>
    </Container>
  )
}

export default HrManagementPage
