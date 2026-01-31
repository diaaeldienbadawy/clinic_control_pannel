import React from 'react'
import CustomImageUpload from '../../MyLib/Components/CustomImageUpload'
import { Prop } from '../../MyLib/Structure/ViewModels/Abstracts/Prop'

export const DoublePartArticalPageEditableFile = (props:{value:Prop<string|File>}) => {
  return (
    <CustomImageUpload onSelect={a=>{props.value.Value=a}} value={props.value.Value}/>
  )
}

export const DoublePartArticalElementEditableFile = (props:{value:Prop<string|File>, deletable:boolean , onDelete?:(v:Prop<string|File>)=>void}) => {
  return (
    <div className='d-flex' >
      <div  className='rounded-2 overflow-hidden d-flex flex-column px-0 py-3' style={{width:'100%' ,   maxHeight:'400px'}}>
        <CustomImageUpload onSelect={a=>{props.value.Value=a}} value={props.value.Value} ratio='16x9'/>
      </div>
      {
        props.deletable?(
          <div className='my-auto material-symbols-outlined btn-delete c-pointer' onClick={()=>{ if(props.onDelete)props.onDelete(props.value) }}>delete</div>
        ):(null)
      }
    </div>

  )
}

