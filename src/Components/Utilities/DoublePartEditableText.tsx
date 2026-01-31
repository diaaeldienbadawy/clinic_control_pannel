import React, { useEffect, useRef, useState } from 'react'
import { Prop } from '../../MyLib/Structure/ViewModels/Abstracts/Prop'


export const DoublePartArticalPageEditableText = (props:{value:Prop<string>, deletable:boolean , onDelete?:(v:Prop<string>)=>void , subClass?:string}) => {
  const [edit, setEdit] = useState(false)
  return (
    <div>
        {
          edit?(        
          <div className=' d-flex justify-content-center text-color-primary-II fw-bold py-5 rounded-0 text-center'>
            <input type="text" className='input-field w-100' style={{ maxWidth:'250px' }} value={props.value.Value} onChange={a=>props.value.Value =(a.target.value)} />
            <div className='material-symbols-outlined btn-clr-save c-pointer my-auto px-2' onClick={()=>setEdit(false)}>save</div>
            {
              props.deletable?(
                <div className='my-auto material-symbols-outlined btn-delete c-pointer' onClick={()=>{if(props.onDelete)props.onDelete(props.value)}}>delete</div>
              ):(null)
            }
          </div>):(null)
        }
        <h1 className={` fw-bold py-sm-5 py-2 rounded-0 text-center ${props.subClass}`}>
          {props.value.Value}
          {
            edit?(null):(<span className={`material-symbols-outlined btn-clr-close c-pointer px-3`} onClick={()=>setEdit(true)}>edit</span>)
          }
        </h1>
    </div>
  )
}

export const DoublePartArticalPageEditableTextArea = (props:{value:Prop<string|undefined>, maxLength?:number , deletable:boolean , onDelete?:(v:Prop<string|undefined>)=>void , subClass?:string}) => {
  const [edit, setEdit] = useState(false)
  return (
    <div>
        {
          edit?(        
          <div className=' d-flex justify-content-center text-color-primary-II fw-bold py-5 rounded-0 text-center'>
            <textarea className='input-field w-100' rows={5} maxLength={props.maxLength} value={props.value.Value} onChange={a=>props.value.Value =(a.target.value)} />
            <div className='material-symbols-outlined btn-clr-save c-pointer my-auto px-2' onClick={()=>setEdit(false)}>save</div>
            {
              props.deletable?(
                <div className='my-auto material-symbols-outlined btn-delete c-pointer' onClick={()=>{if(props.onDelete)props.onDelete(props.value)}}>delete</div>
              ):(null)
            }
          </div>):(null)
        }
        <h1 className={` fw-bold py-sm-5 py-2 rounded-0 text-center ${props.subClass}`}>
          {props.value.Value}
          {
            edit?(null):(<span className={`material-symbols-outlined btn-clr-close c-pointer px-3`} onClick={()=>setEdit(true)}>edit</span>)
          }
        </h1>
    </div>
  )
}


export const DoublePartArticalElementEditableText = (props:{value:Prop<string>, deletable:boolean , onDelete?:(v:Prop<string>)=>void , subClass?:string}) => {
  const [edit, setEdit] = useState(false)
  return (
    <div>
        {
          edit?(        
          <div className='d-flex text-color-primary-II w-100 fw-bold py-1 rounded-0 text-center'>
            <input type="text" className='input-field w-100' style={{ maxWidth:'250px' }} value={props.value.Value} onChange={a=>props.value.Value =(a.target.value)} />
            <div className='material-symbols-outlined btn-clr-save c-pointer my-auto px-2' onClick={()=>setEdit(false)}>save</div>
            {
              props.deletable?(
                <div className='my-auto material-symbols-outlined btn-delete c-pointer' onClick={()=>{if(props.onDelete)props.onDelete(props.value)}}>delete</div>
              ):(null)
            }
          </div>):(null)
        }

        <h1 className={`text-color-primary-II fw-bold py-lg-5 rounded-0 ${props.subClass}`}>
          {props.value.Value}
          {
            edit?(null):(<span className='material-symbols-outlined btn-clr-close c-pointer px-3' onClick={()=>setEdit(true)}>edit</span>)
          }
        </h1>
    </div>
  )

}

export const DoublePartArticalPointElementEditableText = (props:{value:Prop<string>, deletable:boolean , onDelete?:(v:Prop<string>)=>void , subClass?:string}) => {
  const [edit, setEdit] = useState(false)
  return (
    <div>
        {
          edit?(        
          <div className='d-flex text-color-primary-II w-100 fw-bold py-1 rounded-0 text-center'>
            <input type="text" className='input-field w-100' style={{ maxWidth:'250px' }} value={props.value.Value} onChange={a=>props.value.Value =(a.target.value)} />
            <div className='material-symbols-outlined btn-clr-save c-pointer my-auto px-2' onClick={()=>setEdit(false)}>save</div>
            {
              props.deletable?(
                <div className='my-auto material-symbols-outlined btn-delete c-pointer' onClick={()=>{if(props.onDelete)props.onDelete(props.value)}}>delete</div>
              ):(null)
            }
          </div>):(null)
        }

        <div className={`d-flex text-color-primary-II fw-bold py-lg-1 rounded-0 ${props.subClass}`}>
          <ul><li>{props.value.Value}</li></ul>
          {
            edit?(null):(<span className='material-symbols-outlined btn-clr-close c-pointer px-3' onClick={()=>setEdit(true)}>edit</span>)
          }
        </div>
    </div>
  )
}

export const DoublePartArticalParagraphElementEditableText = (props:{value:Prop<string>, deletable:boolean , onDelete?:(v:Prop<string>)=>void , subClass?:string}) => {
  const [edit, setEdit] = useState(false)
  return (
    <div>
        {
          edit?(        
          <div className='d-flex text-color-primary-II w-100 fw-bold py-1 rounded-0 text-center'>
            <textarea className='input-field w-100' style={{ maxWidth:'250px' }} value={props.value.Value.replaceAll('</br>','\n')} onChange={a=>props.value.Value =(a.target.value.replaceAll('\n','</br>'))} />
            <div className='material-symbols-outlined btn-clr-save c-pointer my-auto px-2' onClick={()=>setEdit(false)}>save</div>
            {
              props.deletable?(
                <div className='my-auto material-symbols-outlined btn-delete c-pointer' onClick={()=>{if(props.onDelete)props.onDelete(props.value)}}>delete</div>
              ):(null)
            }
          </div>):(null)
        }

        <h1 className={`text-color-primary-II fw-bold py-lg-5 rounded-0 ${props.subClass}`}  >
          {props.value.Value}
          {
            edit?(null):(<span className='material-symbols-outlined btn-clr-close c-pointer px-3' onClick={()=>setEdit(true)}>edit</span>)
          }
        </h1>
    </div>
  )

}


export const DoublePartArticalVideoElementEditableText = (props:{value:Prop<string>, deletable:boolean , onDelete?:(v:Prop<string>)=>void , subClass?:string}) => {
  const [edit, setEdit] = useState(false)
  return (
    <div>
        {
          edit?(        
          <div className='d-flex text-color-primary-II w-100 fw-bold py-1 rounded-0 text-center'>
            <textarea className='input-field w-100' style={{ maxWidth:'250px' }} value={props.value.Value.replaceAll('</br>','\n')} onChange={a=>props.value.Value =(a.target.value.replaceAll('\n','</br>'))} />
            <div className='material-symbols-outlined btn-clr-save c-pointer my-auto px-2' onClick={()=>setEdit(false)}>save</div>
            {
              props.deletable?(
                <div className='my-auto material-symbols-outlined btn-delete c-pointer' onClick={()=>{if(props.onDelete)props.onDelete(props.value)}}>delete</div>
              ):(null)
            }
          </div>):(null)
        }

        <h1 className={`text-color-primary-II fw-bold py-lg-5 rounded-0 ${props.subClass}`}  >
          <div className='d-flex ratio ratio-16x9' dangerouslySetInnerHTML={{ __html:props.value.Value }} ></div>
          {
            edit?(null):(<span className='material-symbols-outlined btn-clr-close c-pointer px-3' onClick={()=>setEdit(true)}>edit</span>)
          }
        </h1>
    </div>
  )

}
