import React, { useEffect, useRef, useState } from 'react'
import { Prop } from '../../MyLib/Structure/ViewModels/Abstracts/Prop'

const ServiceDescription = (props:{value:Prop<string>, deletable:boolean , onDelete?:(v:Prop<string>)=>void , subClass?:string}) => {
  const [edit, setEdit] = useState(false)
  const [description, setDescription] = useState(props.value.Value)

  useEffect(()=>{ props.value.Value = description },[description])
  const divRef = useRef<HTMLDivElement>(null);

  const KeyPressHandling = (event: React.KeyboardEvent<HTMLElement>)=>{
    if(event.key === 'Backspace'){
      if(props.value.Value.endsWith("</br>")){
        props.value.Value = props.value.Value.slice(0,-4)
      }
    }else if(event.key ==='Enter'){
      props.value.Value = props.value.Value +"</br>"
    }
  }

  const moveCursorToEnd = () => {
    const div = divRef.current;
    if (div) {
      const range = document.createRange();
      const selection = window.getSelection();

      // ضبط النطاق إلى نهاية النص
      range.selectNodeContents(div);
      range.collapse(false); // نهاية النص
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const parseContent = (htmlString: string): {type:'text'|'iframe' , content:string}[] => {
    const regex = /(<iframe[\s\S]*?<\/iframe>)/g;
    const parts = htmlString?.split(regex);
  
    return parts?parts
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .map((part) => ({
        type: part.startsWith("<iframe") ? "iframe" : "text",
        content: part,
      })):[];
  };


  const contentBlocks = parseContent(props.value.Value);
  return (
    <div>
        {
          edit?(        
          <div className=' d-flex justify-content-start text-color-primary-II fw-bold py-1 rounded-0 text-center'>
             <textarea className='input-field' rows={4} cols={50} wrap="hard" style={{ minWidth:'200px' }}  value={props.value.Value?.replaceAll('</br>','\n')}  onChange={a=>props.value.Value =(a.target.value?.replaceAll('\n','</br>'))} /> 
            <div className='material-symbols-outlined btn-clr-save c-pointer my-auto px-2' onClick={()=>setEdit(false)}>save</div>
            {
              props.deletable?(
                <div className='my-auto material-symbols-outlined btn-delete c-pointer' onClick={()=>{if(props.onDelete)props.onDelete(props.value)}}>delete</div>
              ):(null)
            }
          </div>):(null)
        }
        {
          contentBlocks?.map((item,index)=>(
            item.type=='iframe'?(
              <h5 className={`color-gray py-1  text-end d-flex ratio ratio-16x9 ${props.subClass}`} style={{ maxWidth:'500px' }}>

              <div className=' d-flex ratio ratio-16x9' dangerouslySetInnerHTML={{ __html: item.content}}></div>
            </h5>
            ):(
              <h5 className={`color-gray py-1  text-end  ${props.subClass}`}>

              <div  dangerouslySetInnerHTML={{ __html:  item.content}}></div>
            </h5>
            )
          ))
        }
              {
                edit?(null):(<span className={`material-symbols-outlined btn-clr-close c-pointer px-3`} onClick={()=>setEdit(true)}>edit</span>)
              }
    </div>
  )
}
export default ServiceDescription
