import React, { useEffect, useRef, useState } from 'react'
import { AuthVM } from '../../MyLib/Structure/ViewModels/AuthVM'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { Col, Container, Row } from 'react-bootstrap'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Essentials } from '../../MyLib/Structure/Handlers/functions'
import { useDefaultKey } from '../../MyLib/Structure/Handlers/CustomHocks'

const DeviceActivatePage = () => {
    const control = useVM<AuthVM>(Globals.auth)
    const {button , defaultKeyHandling} = useDefaultKey()

  return (
    <Container className='h-100'>
        <Row className='h-100 justify-content-center'>
            <Col className='d-flex flex-column justify-content-center h-100' md={6}>
                <div>
                    <div className='d-flex justify-content-center py-2'>
                        <label htmlFor="">رقم تفعيل المتصفح</label>
                    </div>
                    <div className='d-flex justify-content-center py-2'>
                        <input type="password" className='input-field' onKeyDown={defaultKeyHandling} value={control.DeviceLoginData.password} onChange={a=>control.DevicePassword = a.target.value} />
                    </div>
                </div>
                <div>
                    <div className='d-flex justify-content-center py-2'>
                        <button ref={button} className='button-I btn-clr-II px-5 py-1' onClick={()=>control.activateDevice()}>دخول</button>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
  )
}

export default DeviceActivatePage
