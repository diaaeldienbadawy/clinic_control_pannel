import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { mainPath } from '../Structure/Constants/MainPath';
import { EditableVM, ViewModel } from '../Structure/Utilities/ViewModelStructure';

const CustomImageUpload = (props:{onSelect:(img:File|string)=>void, value:File|string , editableMode?:boolean , secVm?:EditableVM ,ratio?:'1x1'|'16x9'}) => {
  const initial:string = `${mainPath}/assets/images/empty.png`
  const [editableMode, setEditableMode] = useState(props.editableMode==undefined?true:props.editableMode)
  const [ini, setIni] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File|string>(props.value)

    const inp = useRef<HTMLInputElement>(null)
    const inpClicked = ()=>{
        if(editableMode)inp.current?.click()
    }
    useEffect(()=>{ if(props.secVm)setEditableMode(props.secVm.Editing)},[props.secVm?.Editing])
    useEffect(()=>{ 
      if(ini){
        props.onSelect(selectedFile) 
      }else{
        setIni(true)

      } 
    },[selectedFile])
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file:File|string = event.target.files?event.target.files[0]:'';
    if (file) {
      setSelectedFile(file)
    }
  };

  return (
    <div className={`position-relative ${props.ratio?'h-100':'w-100 h-100'}`}>
      <input
        ref={inp}
        type="file"
        id="upload-button"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
        <div className={`${props.ratio?(`ratio ratio-${props.ratio} h-100`):'w-100 h-100'} rounded-2 overflow-hidden position-relative`}>
          {
            editableMode?(          
            <div className='wrapping c-pointer'>
              <div className='my-auto w-100 h-100 d-flex justify-content-center'  onClick={()=>inpClicked()}>
                <div className='my-auto'>
                  تحميل صورة  
                </div>

              </div>
              <div 
            className='position-absolute material-symbols-outlined btn-clr-close c-pointer rounded-1' 
            style={{ 
                top:'10px',
                left:'10px',
                background:'rgba(200,200,200,0.2)',
                boxShadow:'0px 0px 7px 0.2px rgba(200,200,200,0.8)',
             }}
            onClick={()=>{
              if (inp.current) {
                inp.current.value = ""; // إعادة تعيين القيمة
              }
              setSelectedFile('')
            }}
             >
              close
        </div>
            </div>):(null)
          }
          <img
            src={selectedFile?((selectedFile instanceof File)?URL.createObjectURL(selectedFile):selectedFile) : initial}
            alt="Preview"
            style={{ width:'100%' , height:'100%' }}
          />
        </div>
        {
          editableMode?(<div 
            className='position-absolute material-symbols-outlined btn-clr-close c-pointer rounded-1' 
            style={{ 
                top:'10px',
                left:'10px',
                background:'rgba(200,200,200,0.2)',
                boxShadow:'0px 0px 7px 0.2px rgba(200,200,200,0.8)',
             }}
             >
              close
        </div>):(null)
        }
        
    </div>
  );
};

export default CustomImageUpload;
