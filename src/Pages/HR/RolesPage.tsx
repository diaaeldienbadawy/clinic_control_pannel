import React, { useEffect, useRef, useState } from 'react'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Col, Container, Row } from 'react-bootstrap'
import { Essentials } from '../../MyLib/Structure/Handlers/functions'
import { ListVM } from '../../MyLib/Structure/ViewModels/Abstracts/ListVM'
import { Role } from '../../Structure/Models/Role'
import { RoleClient } from '../../Structure/Api/Clients/RoleClient'

const RolesPage = () => {
    const control = useVM<RolesPageVM>(new RolesPageVM())
    const addRef = useRef<HTMLSpanElement>(null)
    useEffect(()=>{
      control.initiate()
    },[])
  return (
    <Container className='py-5'>
      <Row className=' justify-content-center py-5'>
        <Col md={6} lg={4} xl={3} className='px-0'>
          <h4 className='text-center'>اضافة مهنة جديد</h4>
          <div className='py-2 d-flex justify-content-between'>
            <input 
              onKeyDown={a=>Essentials.EnterKeyPressHandling(a,()=>addRef.current?.click())} 
              type="text" className='input-field w-100' value={control.NewItem?control.NewItem.role:''} 
              onChange={a=>control.NewItem ={role:a.target.value}} 
            />
            <span ref={addRef} className='material-symbols-outlined c-pointer btn-clr-save my-auto px-2' onClick={()=>control.add()}>add</span>
          </div>
        </Col>
      </Row>
      <Row className=' justify-content-start py-5'>
      {
      control.ShowWithMessege(
        control.Data.map((item,index)=>{
          const Item = ()=>{
            const [id, setId] = useState(item?.id??'0')
            const [edit, setEdit] = useState(false)
            const [value, setValue] = useState(item?.role)
            const ref = useRef<HTMLSpanElement>(null)
            const [deleting, setDeleting] = useState(false)
          
            return(
              <Col key={index} md={6} lg={4} className='px-md-4 py-3 px-0'>
                {
                  deleting?
                  (<div className='p-2 rounded-2 border d-flex justify-content-between'>
                    <div>هل تريد حذف المهنة .. {value} ؟</div>
                    <div className='material-symbols-outlined text-success'  onClick={()=>control.delete(id)}>check</div>
                    <div className='material-symbols-outlined text-danger' onClick={()=>setDeleting(false)}>close</div>
                  </div>):(
                  <div className='py-1 px-md-2 rounded-2 border row justify-content-between'>
                    <div className='col-sm-auto col-12 px-md-3 px-2 d-flex'>
                      {
                        edit?(
                          <input onKeyDown={a=>Essentials.EnterKeyPressHandling(a,()=>ref.current?.click())} type="text" className='input-field w-100' value={value} onChange={a=>setValue(a.target.value)} />
                        ):(
                          <h5 className='my-auto'>{value}</h5>
                        )
                      }
                    </div>
                    <div className='my-auto col-sm-auto col-12 g-5  d-flex justify-content-end px-md-3 p-1'>
                      {
                        edit?(
                          <span ref={ref} className='material-symbols-outlined c-pointer btn-clr-save px-1' onClick={()=>{ control.edit({id:id , role:value??''},()=>setEdit(false))}}>save</span>
                        ):(
                          <span className='material-symbols-outlined c-pointer btn-clr-close px-1' onClick={()=>setEdit(true)}>edit</span>
                        )
                      }
                      <span className='material-symbols-outlined c-pointer btn-delete px-1' onClick={()=>setDeleting(true)}>delete</span>
                    </div>
                  </div>
                  )
                }
              </Col>
            )
          }

          return(<Item/>)
          }
        )
      )  
      }
      </Row>

    </Container>
  )
}

export default RolesPage

class RolesPageVM extends ListVM<Role>{
  constructor(){
      super(RoleClient, false)
  }
}