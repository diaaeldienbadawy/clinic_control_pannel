import React, { FC, useState } from 'react'
import { ProfilePageVM } from './ProfilePage'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'

const CreateProfileExperience:FC<{vm:ProfilePageVM}> = ({vm}) => {
    const [place, setPlace] = useState<string>('')
    const [jobTitle, setJobTitle] = useState<string>('')
  return (
    <>
        <div>
          <div className='p-2'>
            <input type="text" className='input-field' value={place}  onChange={a=>setPlace(a.target.value)} placeholder='جهة العمل'/>
          </div>
          <div className='p-2'>
            <input type="text" className='input-field' value={jobTitle}  onChange={a=>setJobTitle(a.target.value)} placeholder='المسمى الوظيفي'/>
          </div>
        </div>
        <div className='d-flex justify-content-center p-2'>
            <button 
                className='button-I btn-clr-II px-5 py-1'
                onClick={()=>{
                  Globals.popup.close()
                  vm.addExperience({place:place , job_title:jobTitle, profile_id:vm.data.id})
                }}
            >اضافة</button>
        </div>
    </>

  )
}
export default CreateProfileExperience
