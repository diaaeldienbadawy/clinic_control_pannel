import React, { useEffect, useRef, useState } from 'react'
import { AuthVM } from '../../MyLib/Structure/ViewModels/AuthVM'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { Col, Container, Row } from 'react-bootstrap'
import { Essentials } from '../../MyLib/Structure/Handlers/functions'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { useDefaultKey } from '../../MyLib/Structure/Handlers/CustomHocks'

const LoginPage = () => {
    const control = useVM<AuthVM>(Globals.auth)
    const {button , defaultKeyHandling} = useDefaultKey()

  return (
    <div className='h-100 my-auto w-100' >
        <Row className='h-100 justify-content-center'>
            <Col className='d-flex flex-column justify-content-center h-100' md={6}>
                <div>
                    <div className='d-flex justify-content-center py-2'>
                        <label htmlFor="">الرقم الوظيفي</label>
                    </div>
                    <div className='d-flex justify-content-center py-2'>
                        <input type="text" 
                        className='input-field' 
                        value={control.LoginData.employee_key} 
                        onChange={a=>control.Employee_Key = a.target.value} 
                        onKeyDown={defaultKeyHandling}                        />
                    </div>
                </div>
                <div>
                    <div className='d-flex justify-content-center py-2'>
                        <label htmlFor="">كلمة السر</label>
                    </div>
                    <div className='d-flex justify-content-center py-2'>
                        <input type="password" 
                        className='input-field' 
                        value={control.LoginData.password} 
                        onChange={a=>control.Password = a.target.value} 
                        onKeyDown={defaultKeyHandling}
                        />
                    </div>
                </div>
                <div className='d-flex mx-auto'>
                    <div className='d-flex justify-content-center py-2'>
                        <input
                        id='remember_me'
                        type="checkbox" 
                        className='input-field' 
                        checked={control.LoginData.remember} 
                        onChange={a=>control.Remmeber = a.target.checked} 
                        onKeyDown={defaultKeyHandling}
                        />
                    </div>
                    <div className='d-flex justify-content-center py-2 px-3'>
                        <label htmlFor="remember_me">تذكرني</label>
                    </div>
                </div>
                <div>
                    <div className='d-flex justify-content-center py-3'>
                        <button ref={button} className='button-I btn-clr-II px-5 py-1' onClick={()=>control.login()}>دخول</button>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
  )
}

export default LoginPage
