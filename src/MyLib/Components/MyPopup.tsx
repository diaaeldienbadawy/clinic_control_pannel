import React, { FC, LegacyRef, ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import './MyPopupStyle.css'

const MyPopup:FC<{label?:ReactNode, lableRef?:RefObject<HTMLDivElement> ,  disabled?:boolean, windowClassName?:string,title?:string ,content:(closeRef:RefObject<HTMLDivElement>)=>ReactNode}> = ({label,windowClassName,disabled,title,lableRef,content}) =>{
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupShowing, setPopupShowing] = useState(false)

  const closeRef = useRef<HTMLDivElement>(null)


  const handlePopup = ()=>{
    if(!disabled){
      if(popupShowing){
        setPopupOpen(false)
        setTimeout(()=>setPopupShowing(false) , 300)
      }else {
        setPopupShowing(true)
        setTimeout(()=>setPopupOpen(true ) , 10)
      }
    }
  }


  return (<>
    <div className='d-flex flex-column justify-content-center h-100'>
        <div ref={lableRef} className='d-flex justify-content-center' onClick={handlePopup}>
            {label??(<div className='px-3'>label</div>)}
        </div>
      </div>
      {
      popupShowing?(      
      <div className={`popup`}>
        <div className={`popup-background ${popupOpen?'':'hide'}`}>
          <div className='popup-elements h-100 w-100 d-flex'>
            <div className={`popup-window m-auto ${windowClassName} ${popupOpen?'':'hide'}`}>
              <div className='popup-header p-3 d-flex justify-content-center border-bottom'>
                <div className='w-100 text-center fw-bold'>{title}</div>
                <div ref={closeRef} className='material-symbols-outlined c-pointer btn-delete' onClick={handlePopup}>close</div>
              </div>
              <div className='popup-content p-3'>
                {content(closeRef)}
              </div>
            </div>
          </div>
        </div>
      </div>):null
      }
  </>)
}

export default MyPopup
