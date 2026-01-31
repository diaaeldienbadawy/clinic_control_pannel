import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { SideBarVM } from '../../Structure/ViewModels/Layout/SideBarVM'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { useNav } from '../../MyLib/Structure/CustomHock/useNav'
import { useLocation } from 'react-router-dom'



const SideBar = () => {
    const goTo = useNav()
    const control = useVM<SideBarVM>(Globals.sideBar)
    const location = useLocation()

    useEffect(()=>{ 
        control.getSideTabs() 
    },[])


    /*useEffect(()=> { 
        goTo(control.SideBarPages[1].path)
    },[control.SideBarPages])*/
    
    // const app = document.getElementById('App') as HTMLDivElement
    // if(control.Collapsed){
    //     if(!app?.classList.contains('sideBar-hide'))app?.classList.add('sideBar-hide')
    // }else{
    //     if(app?.classList.contains('sideBar-hide'))app?.classList.remove('sideBar-hide')
    // }


  return (
    <>
    <div className={`sideBar-trigger d-md-none d-block ${control.Collapsed?'sideBar-trigger-collapseed sideBar-hide shadow':''}`}  onClick={()=>control.Collapsed= !control.Collapsed} >
        <div >
            <div style={{ transform:'rotate(90deg)' }}>
            {
                control.Collapsed?'القائمة':'اغلاق'
            }
            </div>

        </div>
        {/* <FontAwesomeIcon icon={faCaretRight} /> */}
    </div>
    <div className={`sideBar py-2 text-white glass-effect-II  ${control.Collapsed?'sideBar-hide':''}`}>

        <div className='p-2 d-flex'>
            <div className=''>
                <div className=' rounded-circle overflow-hidden shadow bg-white' style={{ width:'70px' , height:'70px' }}>
                    <img src={(Globals.auth.Profile?.img as string)??'assets/images/profile.png'} width={'100%'} height={'100%'} style={{ objectFit:'fill' }} />
                </div>
            </div>
            <div className='px-3'>
                <div className='fw-bold text-center fs-5 '>{Globals.auth.Profile?.name}</div>
                <div className='text-center fs-6'>{Globals.auth.Profile?.role?.role}</div>
            </div>
        </div>
        <div className='m-1 py-3 border-bottom border-white'>
            {
                Globals.auth.Profile?.user_admin?.admin?(                
                control.SideBarPages.map((item,index)=>(
                    <div key={index} id={item.page} className={`p-3 py-2 c-pointer ${location.pathname.replace('/','').startsWith(item.path)?'bg-II':''}`} onClick={()=>{ goTo(item.path) ; control.Collapsed = true}}>{item.page}</div>
                )))
                :
                (control.SideBarPages.filter(a=>a.open).map((item,index)=>(
                    <div key={index} id={item.page} className={`p-3 py-2 c-pointer ${location.pathname.replace('/','').startsWith(item.path)?'bg-II':''}`} onClick={()=>{ goTo(item.path) ; control.Collapsed = true}}>{item.page}</div>
                )))
                
            }
        </div>
        <div className='py-3'>
            <div className={`p-3 c-pointer`} onClick={()=>Globals.auth.logout()}>تسجيل خروج</div>
        </div>
    </div>
    </>
  )
}

export default SideBar