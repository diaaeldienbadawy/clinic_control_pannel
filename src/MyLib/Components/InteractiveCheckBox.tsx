import React, { useEffect, useState } from 'react'

const InteractiveCheckBox = (props:{checked:boolean, onCkeck:(value:boolean)=>void}) => {
    const [checked , check]= useState<boolean>(props.checked)
    useEffect(()=>props.onCkeck(checked),[checked])
  return (
    <input type="checkbox" checked={checked} onChange={a=>check(a.target.checked)} />
  )
}

export default InteractiveCheckBox
