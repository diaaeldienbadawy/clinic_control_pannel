import React, { useState } from 'react'
import { Prop } from '../../MyLib/Structure/ViewModels/Abstracts/Prop'

const ServicePrice = (props:{value:Prop<number>, deletable:boolean , onDelete?:(v:Prop<number>)=>void , subClass?:string}) => {
  const [edit, setEdit] = useState(false)
  return (
    <div>
        {
          edit?(        
          <div className=' d-flex justify-content-start text-color-primary-II fw-bold py-1 rounded-0 text-center'>
            <input type="number" className='input-field' style={{ minWidth:'200px' }} value={props.value.Value} onChange={a=>props.value.Value =Number(a.target.value)} />
            <div className='material-symbols-outlined btn-clr-save c-pointer my-auto px-2' onClick={()=>setEdit(false)}>save</div>
            {
              props.deletable?(
                <div className='my-auto material-symbols-outlined btn-delete c-pointer' onClick={()=>{if(props.onDelete)props.onDelete(props.value)}}>delete</div>
              ):(null)
            }
          </div>):(null)
        }
        <h1 className={`color-II fw-bold py-1 rounded-0 text-end ${props.subClass}`}>
          {props.value.Value??0} جنيه
          {
            edit?(null):(<span className={`material-symbols-outlined btn-clr-close c-pointer px-3`} onClick={()=>setEdit(true)}>edit</span>)
          }
        </h1>
    </div>
  )
}

export default ServicePrice
