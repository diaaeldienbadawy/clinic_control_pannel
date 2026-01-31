import React, { FC, useEffect, useState } from 'react'
import { profileCertificate } from '../../Structure/Models/profileCertificate'
import { ProfilePageVM } from './ProfilePage'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import { JsxElement } from 'typescript'

const ProfileCertificate:FC<{ vm:ProfilePageVM}> = ({vm}) => {
    const [content, setContent] = useState<React.ReactElement>(    <>
        {
            vm.data.profile_certificates?.map((item,index)=>(
            <div className='p-5 d-flex ratio ratio-16x9' style={{width:'300px'}}>
                <CustomImageUpload 
                    value={item.profile_cerificate_image} 
                    onSelect={a=>{ 
                        item.profile_cerificate_image=a
                        vm.editCeritificate(item)
                     }} ratio='16x9'/>
              </div>
            ))
        }
        </>)

    useEffect(()=>{
        <>
        {
            vm.data.profile_certificates?.map((item,index)=>(
            <div className='p-5 d-flex ratio ratio-16x9' style={{width:'300px'}}>
                <CustomImageUpload 
                    value={item.profile_cerificate_image} 
                    onSelect={a=>{ 
                        item.profile_cerificate_image=a
                        vm.editCeritificate(item)
                     }} ratio='16x9'/>
              </div>
            ))
        }
        </>
    },[vm.data])
  return (
    content

  )
}

export default ProfileCertificate
