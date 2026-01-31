import React, { useState } from 'react'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { EventClient } from '../../Structure/Api/Clients/EventClient'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import { Col, Row } from 'react-bootstrap'
import { ReviewsPageVM } from './ReviewsPage'
import { ReviewClient } from '../../Structure/Api/Clients/ReviewClient'

const CreateReview:React.FC<{list:ReviewsPageVM}> = ({list}) => {
    const [reviewImg, setReviewImg] = useState<string|File>('')

  const save = ()=>{
    list.loading(async()=>{
        Globals.popup.close()
        await new ReviewClient().insert({ review_img:reviewImg})
        await list.refresh()
    })
  }

  return (
    <Row className='py-3 h-100'>
        <div  className='p-2 col-lg-8 col-md-10 col-12 d-flex ratio ratio-16x9'>
            <div className='d-flex ratio ratio-16x9'>
                <CustomImageUpload  value={reviewImg} onSelect={a=>setReviewImg(a)} ratio='16x9' />
            </div>        
        </div>
        <div className='py-2 d-flex justify-content-center'>
            <button className=' button-I btn-clr-II px-5 py-1' onClick={()=>save()}>اضافة</button>
        </div>
    </Row>
  )
}

export default CreateReview
