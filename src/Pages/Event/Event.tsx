
import { fqa } from '../../Structure/Models/fqa'
import { FqaPageVM } from '../Fqa/FqaPage'
import { EventsPageVM } from './EventsPage'
import { event } from '../../Structure/Models/event'
import { useState } from 'react'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'

const Event:React.FC<{item:event , list:EventsPageVM}> = ({item, list}) => {
  const [content, setContent] = useState(item.content)
  const [eventImg, setEventImg] = useState(item.event_img)
  const [editing, setEditing] = useState(false)

  const save = ()=>{
    list.loading(async()=>{
        await list.edit({id:item.id , content:content , event_img:eventImg})
        await list.refresh()
    })
  }
  const deleteItme = ()=>{
    list.loading(async()=>{
       if(item.id){
        await list.delete(item.id)
        await list.refresh()
       } 
    })
  }

  const Constant = ()=>{
    return(<div className='border w-100 row'>
        <div className='w-100 d-flex flex-column justify-content-between p-2  col-sm-auto col-12'>
            <div className='row flex-md-row-reverse'>
                <div className='d-flex col-md-5 col-12 justify-content-end'>
                    <div className='material-symbols-outlined c-pointer btn-clr-save px-2' onClick={()=>setEditing(true)}>
                        edit
                    </div>
                    <div className='material-symbols-outlined btn-delete c-pointer px-2' onClick={()=>deleteItme()}>
                        delete
                    </div>
                </div>
                <div className='w-100 p-2  col-md-5 col-12'>
                    <h5 dangerouslySetInnerHTML={{ __html:item.content }}></h5>
                </div>
            </div>

        </div>
        <div className='p-2 w-100  col-sm-auto col-12 ratio ratio-16x9' >
            <div className='d-flex p-2'>
                <CustomImageUpload  value={eventImg} onSelect={a=>setEventImg(a)} editableMode={false} />
            </div>
        </div>
        </div>)
  }
  const Editable = ()=>{
    return (<div className='border w-100 row'>
        <div className='w-100 d-flex flex-column justify-content-between p-2 col-sm-auto col-12'>
            <div className='w-100 p-2'>
                <textarea className='input-field' rows={5} cols={50} wrap="hard" style={{ minWidth:'200px' }}  value={content.replaceAll('</br>','\n')}  onChange={a=>setContent(a.target.value.replaceAll('\n','</br>'))} /> 
            </div>
            <div className='d-flex'>
                <div className='material-symbols-outlined c-pointer btn-clr-save px-2'  onClick={()=>save()}>
                    save
                </div>
                <div className='material-symbols-outlined c-pointer btn-clr-close px-2' onClick={()=>{ setContent(item.content); setEventImg(item.event_img); setEditing(false)  }}>
                    close
                </div>
                <div className='material-symbols-outlined btn-delete c-pointer px-2' onClick={()=>deleteItme()}>
                    delete
                </div>
            </div>
        </div>
        <div className='p-2  w-100  col-sm-auto col-12' style={{ height:'250px' }}>
            <div className='d-flex ratio ratio-16x9'>
                <CustomImageUpload  value={eventImg} onSelect={a=>setEventImg(a)}  />
            </div>
        </div>
        </div>)
  }
  return (
    <div  className='py-3 d-flex '>
        {
            editing?(
                <Editable></Editable>
            ):(
                <Constant></Constant>
            )
        }
        {/* <div className='d-flex w-100'>
            <div className='w-100 p-2'>
            {
              editing?(
                <textarea className='input-field' rows={2} cols={50} wrap="hard" style={{ minWidth:'200px' }}  value={content.replaceAll('</br>','\n')}  onChange={a=>setContent(a.target.value.replaceAll('\n','</br>'))} /> 
              ):( <h2 dangerouslySetInnerHTML={{ __html:item.content }}></h2> )
            }
            </div>
            <div className='d-flex'>
                {
                    editing?(    
                        <>
                            <div className='material-symbols-outlined c-pointer btn-clr-save px-2'  onClick={()=>save()}>
                                save
                            </div>
                            <div className='material-symbols-outlined c-pointer btn-clr-close px-2' onClick={()=>{ setContent(item.content); setEventImg(item.event_img); setEditing(false)  }}>
                                close
                            </div>
                        </>            

                    ):(
                        <div className='material-symbols-outlined c-pointer btn-clr-save px-2' onClick={()=>setEditing(true)}>
                            edit
                        </div>
                    )
                }
                <div className='material-symbols-outlined btn-delete c-pointer px-2' onClick={()=>deleteItme()}>
                    delete
                </div>
            </div>
        </div>
        <div className='p-2 d-flex w-100' style={{ height:'250px' }}>
            <div className='d-flex ratio ratio-16x9'>
                <CustomImageUpload  value={eventImg} onSelect={a=>setEventImg(a)} editableMode={editing} />
            </div>
        </div> */}
    </div>

  )
}

export default Event
