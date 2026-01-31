import React, { useState } from 'react'
import { EventsPageVM } from './EventsPage'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { EventClient } from '../../Structure/Api/Clients/EventClient'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import { Col, Row } from 'react-bootstrap'

const CreateEvent:React.FC<{list:EventsPageVM}> = ({list}) => {
    const [content, setContent] = useState('')
    const [eventImg, setEventImg] = useState<string|File>('')

  const save = ()=>{
    list.loading(async()=>{
        Globals.popup.close()
        await new EventClient().insert({content:content , event_img:eventImg})
        await list.refresh()
    })
  }

  return (
    <Row className='py-3 h-100 w-100'>
        <div className='p-2'>
            <textarea className='input-field w-100' rows={2} cols={50} wrap="hard" style={{ minWidth:'200px' }}  value={content.replaceAll('</br>','\n')}  onChange={a=>setContent(a.target.value.replaceAll('\n','</br>'))} /> 
        </div>
        <div  className='p-2 col-lg-8 col-md-10 col-12 d-flex ratio ratio-16x9'>
            <div className='d-flex ratio ratio-16x9'>
                <CustomImageUpload  value={eventImg} onSelect={a=>setEventImg(a)} ratio='16x9' />
            </div>        
        </div>
        <div className='py-2 d-flex justify-content-center'>
            <button className=' button-I btn-clr-II px-5 py-1' onClick={()=>save()}>اضافة</button>
        </div>
    </Row>
  )
}

export default CreateEvent
