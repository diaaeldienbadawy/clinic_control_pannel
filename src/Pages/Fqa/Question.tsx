import React, { useState } from 'react'
import { fqa } from '../../Structure/Models/fqa'
import { FqaPageVM } from './FqaPage'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'

const Question = (props:{item:fqa , list:FqaPageVM}) => {
  const [question, setQuestion] = useState(props.item.question)
  const [answer, setAnswer] = useState(props.item.answer)
  const [editing, setEditing] = useState(false)

  const save = ()=>{
    props.list.loading(async()=>{
        await props.list.edit({id:props.item.id , question:question , answer:answer})
        await props.list.refresh()
    })
  }
  const deleteItme = ()=>{
    props.list.loading(async()=>{
        Globals.popup.close()
       if(props.item.id){
        await props.list.delete(props.item.id)
        await props.list.refresh()
       } 
    })
  }
  return (
    <div  className='py-3'>
        <div className='d-flex flex-md-nowrap flex-wrap flex-wrap-reverse'>
            <div className='w-100 p-2'>
            {
              editing?(
                  <input type="text" className='input-field w-100' style={{ maxWidth:'250px' }} value={question} onChange={a=>setQuestion(a.target.value)} />
              ):( <h4>{props.item.question}</h4> )
            }
            </div>
            <div className='d-flex'>
                {
                    editing?(    
                        <>
                            <div className='material-symbols-outlined c-pointer btn-clr-save px-2'  onClick={()=>save()}>
                                save
                            </div>
                            <div className='material-symbols-outlined c-pointer btn-clr-close px-2' 
                            onClick={()=>{ 
                                setQuestion(props.item.question); 
                                setAnswer(props.item.answer); 
                                setEditing(false) 
                             }}>
                                close
                            </div>
                        </>            

                    ):(
                        <div className='material-symbols-outlined c-pointer btn-clr-save px-2' onClick={()=>setEditing(true)}>
                            edit
                        </div>
                    )
                }
                <div className='material-symbols-outlined btn-delete c-pointer px-2' onClick={()=>{
                    Globals.popup.open({
                        content:<div className='h-100 d-flex flex-column justify-content-between'>
                            <div className='h-100 d-flex'>
                                <div className='m-auto'>
                                     هل تريد حذف السؤال ؟    
                                </div>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <button className='button-I btn-clr-II px-3 py-1'
                                    onClick={()=>{
                                        deleteItme()
                                    }}
                                >موافق</button>
                            </div>
                        </div>
                    })
                }}>
                    delete
                </div>
            </div>
        </div>
        <div className='p-2'>
          {
              editing?(
                  <textarea className='input-field w-100' rows={3}  wrap="hard"   value={answer.replaceAll('</br>','\n')}  onChange={a=>setAnswer(a.target.value.replaceAll('\n','</br>'))} /> 
              ):( <h6>{props.item.answer}</h6> )
          }
        </div>
    </div>

  )
}

export default Question
