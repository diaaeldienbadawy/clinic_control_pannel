import React, { FC, useState } from 'react'
import { ProfilePageVM } from './ProfilePage'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'

const CreateProfileResearch:FC<{vm:ProfilePageVM}> = ({vm})  => {
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [inistitution, setInistitution] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
  return (
    <div className='p-2' >
      <div className='w-100'>
        <div className='d-flex p-1 w-100'>
          <input 
            type="text" 
            className='input-field w-100' 
            placeholder='عنوان البحث'
            value={title} 
            onChange={
              a=>{
                setTitle(a.target.value)
              }
            }
          />
        </div>
        <div className='p-1 d-flex'>
          <div className='d-flex px-1'>
            <input 
              type="date" 
              className='input-field' 
              value={date} 
              onChange={
                a=>{
                  setDate(a.target.value)
                }
              }
            />
          </div>
          <div className='d-flex px-1'>
            <input 
              type="text" 
              className='input-field' 
              placeholder='جهة اصدار البحث'
              value={inistitution} 
              onChange={
                a=>{
                  setInistitution(a.target.value)
                }
              }
            />
          </div>
        </div>
        <div className='d-flex p-1 w-100'>
          <textarea 
            style={{ resize:'none' }}
            className='input-field w-100' 
            placeholder='الوصف...'
            value={description.replaceAll('</br>','\n')} 
            onChange={
              a=>{
                setDescription(a.target.value.replaceAll('\n','</br>'))
              }
            }
          />
        </div>
        <div className='d-flex p-1 w-100'>
          <input 
            type="url" 
            className='input-field w-100' 
            placeholder='رابط البحث'
            value={url} 
            onChange={
              a=>{
                setUrl(a.target.value)
              }
            }
          />
        </div>
      </div>
        <div className='d-flex justify-content-center p-2'>
            <button 
                className='button-I btn-clr-II px-5 py-1'
                onClick={()=>{
                  Globals.popup.close()
                  vm.addResearch({title:title , date:date , inistitution:inistitution , description:description , url:url,profile_id:vm.data.id})
                }}
            >اضافة</button>
        </div>
    </div>
  )
}

export default CreateProfileResearch
