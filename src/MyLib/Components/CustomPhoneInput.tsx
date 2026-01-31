
import React, { CSSProperties, useEffect, useState } from 'react'
import { CountryIso2, CountrySelector } from 'react-international-phone'
import 'react-international-phone/style.css';
import { GeneralMethods } from '../Structure/Handlers/GeneralMethods';

const CustomPhoneInput:React.FC<{className:string,inputClassName?:string,disabled?:boolean,placeholder?:string,value?:string ,setFullNumber?:(numb:string)=>void, style?:CSSProperties , selectorStyle?:CSSProperties, inputStyle?:CSSProperties}> = (props) => {

  //states  
  const [selectedCountry, setSelectedCountry] = useState<CountryIso2>('eg');
  const [mobileNumber , setMobileNumber] = useState<string>('')
  const [countryKey , setCountryKey] = useState<string>('20')
  //functions
  /*const validateNumber = (input:string)=>{
    const regex = /^[0-9]*$/;
    var res = mobileNumber
    if(input.length>0){
      if(regex.test(input[input.length-1])){
        res = input
      }
      if(input === "0") res=''
    }else res =''
    setMobileNumber(res)
  }*/

  function splitPhoneNumber(phoneNumber:string) {
    if(phoneNumber){
      const match = phoneNumber.match(/^\+(\d+)[\s-]?(\d+)$/);
      if (match) {
        return {
          countryCode: match[1],
          phoneNumber: match[2] 
        };
      }
      throw new Error("Invalid phone number format");
    }else {
      return {
        countryCode: '1',
        phoneNumber: '' 
      }
    }

  }

  useEffect(()=>{
    if(props.value){
      try {
        let {countryCode ,phoneNumber } = splitPhoneNumber(props.value)
        setCountryKey(countryCode)
        setMobileNumber(phoneNumber)
        if(countryKey != countryCode)
        setSelectedCountry(GeneralMethods.getCountryFromDialCode(countryCode)??'1')

      } catch (error) {
        
      }
    }
  },[])
  //effects
  useEffect(()=>{ 
    if(props.setFullNumber && mobileNumber)props.setFullNumber('+'+countryKey+' '+mobileNumber) 
  },[mobileNumber])

  useEffect(()=>{ 
    if(props.setFullNumber && mobileNumber)props.setFullNumber('+'+countryKey+' '+mobileNumber) 
  },[countryKey])
  return (
    <div className={`${props.className} p-0 `} style={{display:'flex', direction:'ltr',...props.style}}>
      <CountrySelector
        disabled = {props.disabled}
        style={{...props.selectorStyle, display:'inline-block',height:'100%'}}
        selectedCountry={selectedCountry} // استخدام الخاصية الصحيحة
        onSelect={(country) => {  setSelectedCountry(country.iso2); setCountryKey(country.dialCode); }} // تحديد دالة تغيير الدولة
      />
      <input  disabled = {props.disabled} className={`${props.inputClassName} h-100 my-auto p-1 px-3`} placeholder={props.placeholder} value={mobileNumber} onChange={(a)=>setMobileNumber(a.target.value[0]=='0'?a.target.value.replace('0','').replace(/\D/g, ""):a.target.value.replace(/\D/g, ""))} style={{position:'relative' , height:'100%' , width:'100%' ,margin:'0px auto', padding:'0px 5px' , border:'none' , outline:'none' ,background:'none', ...props.inputStyle}}></input>
    </div>
  )
}

export default CustomPhoneInput
