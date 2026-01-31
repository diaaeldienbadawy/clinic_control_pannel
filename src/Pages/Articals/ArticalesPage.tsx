import React, { useEffect } from 'react'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Col, Container, Row } from 'react-bootstrap'
import Pagination from '../../Components/Utilities/Pagination'
import { Params, useLocation, useParams } from 'react-router-dom'
import { useNav } from '../../MyLib/Structure/CustomHock/useNav'
import { navigator } from '../../MyLib/Components/Facilities'
import { ArticalesPageVM } from '../../Structure/ViewModels/Management/ArticalPage'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'

const ArticalesPage = () => {
  const control = useVM<ArticalesPageVM>(new ArticalesPageVM())
    const location = useLocation()
    useEffect(()=>{
      control.getData(Number(new URLSearchParams(location?.search).get('page')??1))
    },[])
  return (
    <>
      {control.Show(
    <Container className='py-5' style={{ minHeight:'100%' }}>
      <div className='d-flex flex-column justify-content-between h-100' >
        <div className='h-100'>
          <h3 className='text-center fw-bold color-II'>المقالات</h3>

          <Row className='py-5'>
            <div>
              <button className='button-I btn-clr-II px-5 py-1 fs-3 ' onClick={()=>navigator.CreateArtical()}>اضافة مقال</button>
            </div>
          {
              control.Data && control.Data.data?(control.Data?.data.map((item,index)=>(
                <Col className='py-3' key={index} md={6} xl={4}>
                  <div className='artical-card mx-auto h-100'>
                    <div className='ratio ratio-16x9' onClick={()=>navigator.CreateArtical(item.slug)}>
                      <img className='w-100 ratio ratio-16x9' src={item.img as string??'assets/images/empty.png'} alt="" />
                    </div>
                    <div className='h-100 p-2'>
                      <div className='d-flex justify-content-between'>
                        <h4 className='fw-bold' onClick={()=>navigator.CreateArtical(item.slug)}>{item.title}</h4>
                        <div className='d-flex'>
                          <div className='px-2 btn-clr-save c-pointer  material-symbols-outlined' onClick={()=>navigator.CreateArtical(item.slug)}>edit</div>
                          <div className='px-2 btn-delete c-pointer z-3  material-symbols-outlined' onClick={()=>
                            Globals.popup.open({
                              title:'تنبيه',
                              content:
                              <div className='d-flex flex-column justify-content-between h-100'>
                                <div className='d-flex flex-column justify-content-center h-100'>
                                  'هل تريد حذف المقال ؟'
                                </div>
                                <div className='d-flex justify-content-center'>
                                  <div className='button-I btn-clr-II px-3 py-1 c-pointer'
                                    onClick={()=>{
                                      Globals.popup.close()
                                      control.delete(item)
                                    }}
                                  >موافق</div>
                                </div>
                              </div>
                            })}
                            >delete</div>
                        </div>
                      </div>
                      
                      <p>{item.prief}</p>
                    </div>
                  </div>
                </Col>
              ))):null
            
          }
          </Row>
        </div>
        <div>
          <Pagination pagesCount={control.Data?.pagination.total_pages} initial={0} onPageChange={(page)=>{ control.getData(Number(page)) }  }/>
        </div>
      </div>
    </Container>)}</>
  )
}

export default ArticalesPage
