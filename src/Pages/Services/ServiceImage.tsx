import React from 'react'
import { Prop } from '../../MyLib/Structure/ViewModels/Abstracts/Prop'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'

const ServiceImage = (props:{value:Prop<string|File>}) => {
    return (
      <CustomImageUpload onSelect={a=>{props.value.Value=a}} value={props.value.Value}/>
    )
  }

export default ServiceImage
