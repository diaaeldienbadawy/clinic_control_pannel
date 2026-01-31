import React, { useEffect } from 'react'
import { ListVM, PaginatedListVM } from '../../MyLib/Structure/ViewModels/Abstracts/ListVM'
import { beforeAndAfterCategory } from '../../Structure/Models/beforeAndAfterCategory'
import { useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure'
import { BranchsPageVM } from '../Branchs/BranchsPage'
import { useLocation } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Pagination from '../../Components/Utilities/Pagination'
import { BeforeAndAfterCategoryClient } from '../../Structure/Api/Clients/BeforeAndAfterCategoryClient'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'
import { navigator } from '../../MyLib/Components/Facilities'

export const BeforeAndAfterCategoriesPage = () => {
      const control = useVM<BeforeAndAfterCategoriesPageVM>(new BeforeAndAfterCategoriesPageVM())
      const location = useLocation()
      useEffect(()=>{
        control.initiate()
      },[])
      const getRandomNumber = () => {
        const numbers = [1, 1.1, 1.2];
        return numbers[Math.floor(Math.random() * numbers.length)];
      };
  return (
    <Container className='py-5' style={{ minHeight:'100%' }}>
      <div className='d-flex flex-column justify-content-between h-100'>
        <h3 className='text-center'>البومات صور قبل و بعد</h3>
        <div className='d-flex justify-content-start'>
            <button className='button-I btn-clr-II px-5 py-1 c-pointer' onClick={()=>navigator.BeforeAndAfterCategory()}>البوم جديد</button>
        </div>
        <div className='py-4'>
            {
                control.Data?.map((item,index)=>(
                    <div className='py-3 border-bottom' onClick={()=>navigator.BeforeAndAfterCategory(item.id)}>
                        <div className='d-flex justify-content-between'>
                            <h3>{item.title}</h3>
                            <div className='d-flex-column material-symbols-outlined c-pointer btn-delete'
                                onClick={()=>Globals.popup.open({
                                    content:
                                    <div className='d-flex flex-column justify-content-between h-100'>
                                        <div className='d-flex flex-column justify-content-center h-100'>
                                            هل تريد حذف الالبوم " {item.title} "
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <button className='button-I btn-clr-II bg-danger c-pointer px-3 py-1'
                                                onClick={()=>{ control.delete(item.id??''); Globals.popup.close() }}
                                            >موافق</button>
                                        </div>
                                    </div>
                                })}
                            >
                                delete
                            </div>
                        </div>
                        <div className=' color-gray' dangerouslySetInnerHTML={ { __html:item.description??'' } }></div>
                        <div className='d-flex flex-wrap justify-content-start '>
                        {
                            item.before_and_afters?.map((it,ind)=>(
                                <div className='p-3'>
                                    <div className='position-relative d-flex ratio ratio-16x9  border-0 p-0 m-0 bg-transparent' style={{ width:'200px' }}>
                                        <div className='position-absolute w-100 h-100 top-0 start-0 d-flex flex-column border-0 justify-content-end p-0 m-0 z-2 rounded-3 overflow-hidden'>
                                            <div className=' glass-effect-I px-3 py-2 border-0 '>
                                                {it.title}
                                            </div>
                                        </div>
                                        {
                                            it.before_and_after_photos?.map((photo,photoInd)=>photoInd>3?null:(
                                                <div className={`position-absolute w-100 h-100 top-0 start-0 rounded-3 overflow-hidden shadow `} style={{ transition:'transform 4s ease-in-out' ,zIndex:-photoInd ,transform:`translate(${-photoInd*5}px,${photoInd*5}px)` }}>
                                                    <img src={photo.before_and_after_img as string} className='w-100 h-100'/>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                ))
            }
        </div>
      </div>
    </Container>
  )
}

export class BeforeAndAfterCategoriesPageVM extends ListVM<beforeAndAfterCategory>{
    constructor(){
        super( BeforeAndAfterCategoryClient , false)
    }
}


