import { useEffect} from 'react'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { Col, Container, Row } from 'react-bootstrap'
import CustomSelect from '../../MyLib/Components/CustomSelect'
import EditableArticalElement from '../../Components/Utilities/EditableArticalElement'
import { useParams } from 'react-router-dom'
import { DoublePartArticalPageEditableText, DoublePartArticalPageEditableTextArea } from '../../Components/Utilities/DoublePartEditableText'
import { DoublePartArticalPageEditableFile } from '../../Components/Utilities/DoublePartEditableFile'
import { navigator } from '../../MyLib/Components/Facilities'
import { EditableArticalPageVM } from '../../Structure/ViewModels/Management/ArticalPage'
import { articalElementType } from '../../Structure/Models/Articale'

const CreateArticalPage = () => {
  const {id} = useParams<{id:string}>()
  const control = useVM<EditableArticalPageVM>(new EditableArticalPageVM())
  useEffect(()=>{
    control.initiate(id)
  },[])
  return (
    <Container>
        <Row className='justify-content-center py-5'>
        {
          control.Show(
            <Col md={10}>
                <div className='row flex-sm-row-reverse '>
                  <div className='my-auto btn-delete c-pointer text-nowrap col-sm-auto col-12 text-start ' onClick={()=>control.delete(()=>navigator.Articals())}> 
                      حذف المقال
                  </div>
                  <div className='col-sm-auto col-12 mx-auto' >
                    <DoublePartArticalPageEditableText value={control.Title}  deletable={false} subClass='color-II'/>
                  </div>

                </div>
                
                <Row className='pb-lg-5'>
                <Col className='border-md-end border-md-start px-md-5 pb-5 px-0' md={12}>
                  <div className='pb-5 d-flex ratio ratio-16x9'>
                    
                    <div className='ratio ratio-16x9 d-flex px-0 shadow rounded-2 overflow-hidden' style={{width:'100%' }} >
                        <DoublePartArticalPageEditableFile value={control.Img} />
                    </div>
                  </div>
                  <div className='p-2'>
                    <div className='border rounded-2 p-3'>
                      <DoublePartArticalPageEditableText subClass='fs-4 color-gray' value={control.Prief} deletable={false}/>
                    </div>
                  </div>
                  <div className='p-2'>
                    <div className='border rounded-2 p-3'>
                      <Col md={10} xl={8}>
                        {
                          control.data?(control.data?.elements?.map((item)=>(<EditableArticalElement element={item} listVm={control}/>))):(null)
                        }
                      </Col>
                      <div className='d-flex flex-wrap justify-content-around'>
                        <div className='d-flex flex-column justify-content-center'>
                          <div className='py-2 my-auto'>
                            <h5 className='px-2 fw-bold  my-auto'>اضافة عنصر</h5>
                          </div>
                        </div>
                        <div className='p-2'>
                          <CustomSelect 
                            clearable = {false}
                            list={[{label:'عنوان فرعى' , value:'subtitle'}, {label:'صورة' , value:'img'} , {label:'فقرة نصية' , value:'paragraph'},{label:'عنصر قائمة' , value:'ul'},{label:'فيديو' , value:'video'}]} 
                            selected={control.NewElement}
                            onSelect={a=>control.NewElement=(a as articalElementType)}
                          />
                        </div>
                        <div className='p-2 my-auto'>
                          <button className='button-I btn-clr-II px-5 fs-5 fw-bold' onClick={()=>{control.addElement({type:control.NewElement ,content:''})}}>
                            اضافة
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='p-2'>
                    <div className='border rounded-2 p-3'>
                      <h5>الكلمات المفتاحية
                        <sub className='px-2'>( افصل بين الكلمات المفتاحية بالعلامة " , " )</sub>
                      </h5>
                      <DoublePartArticalPageEditableTextArea subClass='fs-4 color-gray'  value={control.Keywords} deletable={false}/>
                    </div>
                  </div>
                </Col>
                </Row>
                <Row className='pb-5'>
                    <Col className='d-flex justify-content-center'>
                      <button className='button-I btn-clr-II px-5 fs-5 fw-bold' onClick={()=>{control.send()}}>
                        حفظ المقال
                      </button>
                    </Col>
                 
                </Row>
            </Col>
          )
        }
        </Row>
    </Container>
  )
}

export default CreateArticalPage
