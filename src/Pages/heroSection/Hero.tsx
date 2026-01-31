import React, { FC, useState } from 'react'
import { heroSection } from '../../Structure/Models/heroSection'
import { Col, Row } from 'react-bootstrap'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import ColorSelection from '../../MyLib/Components/ColorSelection'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { HeroSectionPageVM } from './HeroSectionPage'

const Hero:FC<{item:heroSection,vm:HeroSectionPageVM}> = ({item,vm}) => {
    const [color, setColor] = useState(item.color)
    const [img, setImg] = useState(item.hero_img)



    function parseRGBA(color: string): { r: number; g: number; b: number; a: number }  {
      const rgbaRegex = /^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\s*\)$/;
      const match = color.match(rgbaRegex);

      if (!match) {
        console.error('Invalid RGBA color format');
        return { r : 0, g:0 , b:0, a:0 } 
      }
    
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
    
      return { r, g, b, a };
    }

      const send =()=>{
        vm.loading(async()=>{
          await vm.edit({id:item.id,color:color , hero_img:img})
        })
      }

      const delet =()=>{
        Globals.popup.open(
          {
            title:'تنبيه',
            content:
            <div className='d-flex flex-column justify-content-between h-100'>
              <div className='d-flex flex-column h-100'>
                هل تريد حذف العنصر ؟
              </div>
              <div className='d-flex justify-content-center'>
                <div className='button-I btn-clr-II px-3 py-1 c-pointer' onClick={()=>{
                  vm.loading(async()=>{
                    Globals.popup.close()
                    if(item.id)
                    await vm.delete(item.id)
                    
                  })
                }}>
                  موافق
                </div>
              </div>
            </div>
          }
        )
      }
  return (
    <Row className='border py-3'>
      <div className='d-flex  pb-3'>
          <div className='material-symbols-outlined c-pointer btn-clr-save px-3' onClick={()=>send()}>save</div>
          <div className='material-symbols-outlined c-pointer btn-delete px-3' onClick={()=>delet()}>delete</div>
      </div>
      <Row className='d-flex'>
        <Col md={12}  className="d-flex flex-column justify-content-center">
          <CustomImageUpload value={img} onSelect={a=>setImg(a)}/>
        </Col>
        {/* <Col md={6} className="d-flex flex-column justify-content-center">
          <ColorSelection color={parseRGBA(color)} onColorSelect={(a)=>setColor(`rgb(${a.r},${a.g},${a.b},${a.a})`)} active='active'/>
        </Col> */}
      </Row>
    </Row>
  )
}

export default Hero
