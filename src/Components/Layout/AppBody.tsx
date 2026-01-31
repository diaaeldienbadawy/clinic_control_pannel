import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation  } from 'react-router-dom'
import {BookingsPage} from '../../Pages/Booking/BookingsPage'
import ArticalesPage from '../../Pages/Articals/ArticalesPage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import { SideBarVM } from '../../Structure/ViewModels/Layout/SideBarVM'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import CreateArticalPage from '../../Pages/Articals/CreateArticalPage'
import SpecializationsPage from '../../Pages/HR/SpecializationsPage'
import HrManagementPage from '../../Pages/HR/HrManagementPage'
import BranchsPage from '../../Pages/Branchs/BranchsPage'
import CreateBranchPage from '../../Pages/Branchs/CreateBranchPage'
import { ServicesPage } from '../../Pages/Services/ServicesPage'
import { CreateServicePage } from '../../Pages/Services/CreateServicePage'
import { FqaPage } from '../../Pages/Fqa/FqaPage'
import { EventsPage } from '../../Pages/Event/EventsPage'
import { HeroSectionPage } from '../../Pages/heroSection/HeroSectionPage'
import { ProfilePage } from '../../Pages/Profile/ProfilePage'
import {CustomerServicePage} from '../../Pages/CustomerService/CustomerServicePage'
import {ServiceBooking} from '../../Pages/Booking/ServiceBooking'
import { ServiceBookingsPage } from '../../Pages/Booking/ServiceBookingsPage'
import ManagementPage from '../../Pages/Booking/ManagementPage'
import { navigator } from '../../MyLib/Components/Facilities'
import HistoryPage from '../../Pages/Booking/HistoryPage'
import { ReviewsPage } from '../../Pages/Reviews/ReviewsPage'
import { CreateBeforeAndAfterCategory } from '../../Pages/BeforeAndAfter/CreateBeforeAndAfterCategory'
import { BeforeAndAfterCategoriesPage } from '../../Pages/BeforeAndAfter/BeforeAndAfterCategoriesPage'

const AppBody = () => {
  const [sideBar,setSideBar] = useState<{viewModel:SideBarVM}>({viewModel:Globals.sideBar})
  const location = useLocation();
  useEffect(()=>{
    if(location.pathname =='/') navigator.Bookings()
  },[location.pathname])
  useEffect(()=>{
    sideBar.viewModel.subscribeUpdate(setSideBar)
  },[])
  return (
    <div className={`app-body`}>
      {/* <div className={`appBody-trigger d-md-none d-block ${sideBar.viewModel.Collapsed?'':'appBody-trigger-flip shadow'}`}  onClick={()=>sideBar.viewModel.Collapsed= !sideBar.viewModel.Collapsed} >
      </div> */}

      <Routes >
          <Route path='/*' element={<ManagementPage/>}></Route>
          <Route path='/management/*' element={<ManagementPage/>}></Route>
          <Route path='/history/*' element={<HistoryPage/>}></Route>
          {
            Globals.auth.Profile?.user_admin?.admin?(
              <>
                  <Route path='/articales' element={<ArticalesPage/>}></Route>
                  <Route path='/articales-create/:id?' element={<CreateArticalPage/>}></Route>
                  <Route path='/hr/*' element={<HrManagementPage/>}></Route>
                  <Route path='/branchs' element={<BranchsPage/>}></Route>
                  <Route path='/branchs-create/:id?' element={<CreateBranchPage/>}></Route>
                  <Route path='/services' element={<ServicesPage/>}/>
                  <Route path='/services-create/:id?' element={<CreateServicePage/>}/>
                  <Route path='/fqas' element = {<FqaPage/>} />
                  <Route path='/events' element = {<EventsPage/>} />
                  <Route path='/reviews' element = {<ReviewsPage/>} />
                  <Route path='/hero' element = {<HeroSectionPage/>} />
                  <Route path='/profile' element = {<ProfilePage/>} />
                  <Route path='/customer-service' element = {<CustomerServicePage/>} />
                  <Route path='/before-and-after-categorys' element = {<BeforeAndAfterCategoriesPage/>} />
                  <Route path='/create-before-and-after-category/:id?' element = {<CreateBeforeAndAfterCategory/>} />
              </>
            ):null
          }

      </Routes>


    </div>
  )
}

export default AppBody
