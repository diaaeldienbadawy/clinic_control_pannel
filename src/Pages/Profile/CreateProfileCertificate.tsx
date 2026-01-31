import React, { FC, useState } from 'react'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import { ProfilePageVM } from './ProfilePage'
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs'

const CreateProfileCertificate:FC<{vm:ProfilePageVM}> = ({vm}) => {
    const [value, setValue] = useState<string|File>('')
  return (
    <>
        <div>
          <CustomImageUpload value={value} onSelect={a=>setValue(a)} ratio='16x9'/>
        </div>
        <div className='d-flex justify-content-center p-3'>
            <button 
                className='button-I btn-clr-II px-5 py-1'
                onClick={()=>{
                  Globals.popup.close()
                  vm.addCertificat({profile_cerificate_image:value,profile_id:vm.data.id})
                }}
            >اضافة</button>
        </div>
    </>

  )
}

export default CreateProfileCertificate
