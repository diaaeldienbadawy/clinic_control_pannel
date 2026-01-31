import React, { useEffect, useState } from 'react';
import { AuthVM } from './MyLib/Structure/ViewModels/AuthVM';
import { Globals } from './MyLib/Structure/Globals/GlobalObs';
import { AxiosRequest } from './MyLib/Structure/Handlers/AxiosHandler';
import LoginPage from './Pages/Auth/LoginPage';
import DeviceActivatePage from './Pages/Auth/DeviceActivatePage';
import { useAuthVM, useVM } from './MyLib/Structure/Utilities/ViewModelStructure';
import SideBar from './Components/Layout/SideBar';
import AppBody from './Components/Layout/AppBody';

function App() {
  
  const control = useAuthVM<AuthVM>(Globals.auth)

    /*const [vm , setVm] = useState<{viewModel:AuthVM}>({viewModel:Globals.auth})
    const control = vm.viewModel
    useEffect(()=>{ control.subscribeUpdate(setVm) },[])*/
  return (
    <>
    {
    control.Show(
      AxiosRequest.deviceControl?(
        control.DeviceAuth?(
          control.Auth?(
            <div id='App'  className="App txt-color-I">
              <SideBar />
              <AppBody/>
            </div>
          ):(<LoginPage/>)
        ):(
          <DeviceActivatePage/>
        )
      ):(
        control.Auth?(
          <div id='App'  className="App  txt-color-I">
            <SideBar />
            <AppBody/>
          </div>
        ):(<LoginPage/>)
      ))
    }
    </>
  );
}

export default App;
