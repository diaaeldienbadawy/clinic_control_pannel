import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import ColorSelection from '../../MyLib/Components/ColorSelection'
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { SketchPicker } from 'react-color';
import { HeroSectionPageVM } from './HeroSectionPage';
import { HeroSectionClient } from '../../Structure/Api/Clients/HeroSectionClient';
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs';

const CreateHero = (props:{vm:HeroSectionPageVM}) => {

  const [color, setColor] = useState('rgb(255,255,255,0)')
    const [img, setImg] = useState<string|File>('')

    const send =()=>{
      Globals.popup.close()
      props.vm.loading(async()=>{
        props.vm.NewItem = {color:color , hero_img:img}
        await props.vm.add()
      })
    }
  return (
    <Row className='justify-content-center py-2'>
    <div className='col-lg-8 col-md-10 col-12 py-3 d-flex ratio ratio-16x9'>
      <CustomImageUpload value={img} onSelect={a=>setImg(a)} ratio='16x9'/>
    </div>
    <div className='d-flex justify-content-center '>
        <button className='button-I btn-clr-II px-3 py-1' onClick={()=>send()}>اضافة</button>
    </div>
  </Row>
  )
}

export default CreateHero
