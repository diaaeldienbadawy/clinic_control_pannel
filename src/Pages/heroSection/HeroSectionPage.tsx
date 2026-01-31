import React, { useEffect } from 'react'
import { ListVM } from '../../MyLib/Structure/ViewModels/Abstracts/ListVM'
import { heroSection } from '../../Structure/Models/heroSection'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { HeroSectionClient } from '../../Structure/Api/Clients/HeroSectionClient'
import { Col, Container, Row } from 'react-bootstrap'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import Hero from './Hero'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import CreateHero from './CreateHero'

export const HeroSectionPage = () => {
    const control = useVM<HeroSectionPageVM>(new HeroSectionPageVM())
    useEffect(()=>{ control.initiate() },[])
  return (
    <Container>
      <Row className=' justify-content-center py-5'>
        <h3 className='text-center fw-bold color-II'>صور الواجهة الرئيسية</h3>
        <Col className='py-0' md={10}>
          <div className='d-flex py-5'>
            <button className='button-I btn-clr-II px-5 py-1 fs-5' onClick={()=>Globals.popup.open( {title:'صورة جديدة' ,content:<CreateHero vm={control}></CreateHero>})}>اضافة صورة</button>
          </div>
        </Col>
        {
          control.Show(
            control.Data?.map((item,index)=>(
              <Col className='py-3' md={10}>
                <Hero item={item} key={index} vm={control}></Hero>
              </Col>
            ))
          )
        }
      </Row>
    </Container>
  )
}

export class HeroSectionPageVM extends ListVM<heroSection>{
    constructor(){
        super(HeroSectionClient , false)
    }
}