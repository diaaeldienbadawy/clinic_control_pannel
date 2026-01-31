import { faTextHeight } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import Select from 'react-select';

const CustomSelect = (props:{list:{ value: string, label: string }[], placeHolder?:string, clearable?:boolean , selected?:string , onSelect?:(value:string)=>void , onClear?:()=>void,onKeyDown?: React.KeyboardEventHandler<HTMLDivElement> | undefined}) => {
    const customStyles = {
        control: (provided: any, state: any) => ({
          ...provided,
          minWidth:'150px',
          outerHeight:'100%',
          innerHeight:'100%',
          borderColor: state.isFocused ? 'rgba(120,120,120,0.5)' : 'rgba(120,120,120,0.5)',
          boxShadow: state.isFocused ? 'none' : 'none',
          '&:hover': {
            borderColor: state.isFocused ? '#aaa' : '#cacaca',
            backgroundColor:'#f2f2f2' ,
          },
          outline: 'none'
        }),
        menu: (provided: any) => ({
          ...provided,

        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'rgb(245, 163, 49)' : state.isFocused ? '#f0f0f0' : '#fff',
            color: state.isSelected ? '#fff' : '#333',
            '&:hover': {
              backgroundColor: state.isSelected ?'rgb(245, 163, 49)' :'#e0e0e0',
            },

        }),
        dropdownIndicator: (provided: any) => ({
          ...provided,
          fontSize: '20px', // حجم السهم
          padding: '0px',
          
        }),
        indicatorSeparator: (provided: any) => ({
          ...provided,
          display: 'none', // إخفاء الفاصل بين السهم والنص (إذا كان موجودًا)
        }),
      };
  return (
    <Select
    onKeyDown={props.onKeyDown}
    className='w-100 input-field p-0 c-pointer border-0'
    isSearchable={false}
    options={props.list}
    placeholder={props.placeHolder}
    styles={customStyles}
    isClearable={props.clearable===undefined?true:props.clearable}
    value={props.list.find(a=>a.value===props.selected)}
    onChange={(a)=> props.onSelect?props.onSelect(a?a.value:''):{}}
    menuPortalTarget={document.body}
    />
  )
}

export default CustomSelect
