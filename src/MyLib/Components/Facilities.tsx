import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReactNotifications } from 'react-notifications-component'
import { NavigatorVM } from '../Structure/ViewModels/NavigatorVM';
import { Popup } from './Popup';

export const navigator:NavigatorVM = new NavigatorVM()
export const QueryPrams:URLSearchParams = new URLSearchParams(window.location.search);


const Facilities = () => {
  return (
    <div style={{position:'absolute' , height:0}}>
      <Popup/>
      <Navigator/>

    </div>
  )
}

export default Facilities


const Navigator = () => {
    const [vm,setVm] = useState<{viewModel:NavigatorVM}>({viewModel:navigator})
    vm.viewModel.subscribeUpdate(setVm)

    const nav = useNavigate()
    const location = useLocation()
    
    vm.viewModel.setNavigator(nav)
    vm.viewModel.setLocator(()=>location.pathname)
    vm.viewModel.setLocation(location)
     return (
       <div >
         
       </div>
     )
   }