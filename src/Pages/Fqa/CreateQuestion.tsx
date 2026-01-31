import React, { useState } from 'react'
import { FqaPageVM } from './FqaPage'
import { FqaClient } from '../../Structure/Api/Clients/FqaClient'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'

const CreateQuestion:React.FC<{list:FqaPageVM}> = ({list}) => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const save = ()=>{
    list.loading(async()=>{
        Globals.popup.close()
        await new FqaClient().insert({question:question , answer:answer})
        await list.refresh()
    })
  }

  return (
    <div className='py-3'>
        <div className='p-2'>
            <input type="text" className='input-field w-100' value={question} onChange={a=>setQuestion(a.target.value)} />
        </div>
        <div className='p-2'>
            <textarea className='input-field w-100' rows={2} cols={50} wrap="hard" style={{ minWidth:'200px' }}  value={answer.replaceAll('</br>','\n')}  onChange={a=>setAnswer(a.target.value.replaceAll('\n','</br>'))} /> 
        </div>
        <div className='py-2 d-flex justify-content-center'>
            <button className=' button-I btn-clr-II px-5 py-1' onClick={()=>save()}>اضافة</button>
        </div>
    </div>
  )
}

export default CreateQuestion
