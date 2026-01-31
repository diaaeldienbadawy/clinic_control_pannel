
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { GeneralMethods } from '../Structure/Handlers/GeneralMethods';

const categories = [
    { value: 'all', label: 'الكل' },
    { value: 'client', label: 'العملاء' },
    { value: 'mosowq', label: 'المسوقين' },
  ];
  
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minWidth:'100px',
      outerHeight:'100%',
      innerHeight:'100%',
      borderRadius: '0px',
      textAlign: 'left',
      padding:'0px',
      borderColor: state.isFocused ? '#ccc' : '#ccc',
      boxShadow: state.isFocused ? 'none' : provided.boxShadow,
      '&:hover': {
        borderColor: state.isFocused ? '#ccc' : '#ccc',
        backgroundColor:'#f2f2f2' ,
      },
      outline: 'none',
      
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '0px',
      textAlign: 'left',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'rgb(70, 8, 123)' : state.isFocused ? '#f0f0f0' : '#fff',
        color: state.isSelected ? '#fff' : '#333',
        '&:hover': {
          backgroundColor:state.isSelected ? 'rgb(70, 8, 123)': '#e0e0e0',
        },
        textAlign: 'left',
        
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      display: 'none', // إخفاء السهم تمامًا
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: 'none', // إخفاء الفاصل بين السهم والنص (إذا كان موجودًا)
    }),
  };
  
const Search = (props:{id?:string,hasNoSelect?:boolean , options?:{value: string, label:string }[] ,selected?:string , onSearch?:(value:string)=>void}) => {
  useEffect(()=>{ 
    GeneralMethods.deActivateForm('search-form-'+props.id)
  },[])  
    const options = [{value:'all' , label:'الكل'}] 
    props.options?.map(item=>options.push(item))
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    };
    const handleCategoryChange = (selectedOption: any) => {
      setSelectedCategory(selectedOption);
    };

    const handleSearch = () => {
      if(props.onSearch)props.onSearch(searchTerm)
    };
  
    const button = useRef<HTMLButtonElement>(null)

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        button.current?.click()
      }
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', position:'relative', width:'100%', height:'100%' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
        className='rounded-end-3'
        onKeyDown={handleKeyDown}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          minWidth:'25px',
          flex: '1',
          height:'100%',
          outline:'none'
        }}
      />
      {props.hasNoSelect?(null ):(<Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        options={options}
        styles={customStyles}
        className='h-100 text-start d-flex p-0'
        isSearchable={false}
        isRtl={false}
      />)}
     
      <button
        ref={button}
        onClick={handleSearch}
        className='rounded-start-3 search txt-color-I'
        style={{
          padding: '5px 15px',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          color: 'rgb(37, 0, 70)',
          cursor: 'pointer',
          marginLeft: '10px',
          height:'100%'
        }}
      >
        <FontAwesomeIcon icon={faSearch}/>
      </button>
      
    </div>
      // <form id={'search-form-'+props.id} action="" style={{ display: 'flex', alignItems: 'center', position:'relative', width:'100%' }}>

      // </form>
    );
}

export default Search
