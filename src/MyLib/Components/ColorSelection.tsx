import React, { FC, useState } from 'react'
import { BlockPicker, RGBColor, SketchPicker } from 'react-color';
import { RgbColor } from 'react-colorful';


const ColorSelection:FC<{color?:RGBColor, onColorSelect:(color:RGBColor)=>void , active?:'active'|'inactive'}> = ({color,onColorSelect,active}) => {

    const [sketchPickerColor, setSketchPickerColor] = useState<RGBColor>(color??{r:255,g:255,b:255,a:1});
  
    const [select, setSelect] = useState(active??false)

  return (
    <div className='d-flex justify-content-center p-3 my-auto w-100'>
        {
            select?(
                <div className="sketchpicker d-flex justify-content-between w-100">
                    <div className='d-flex w-100'>
                        <SketchPicker
                          disableAlpha
                          onChange={(color) => {
                            setSketchPickerColor(color.rgb);
                            onColorSelect(color.rgb)
                          }}
                          color={sketchPickerColor}
                        />
                    </div>

                    <div className='d-flex flex-column justify-content-center w-100'>
                        <div className='d-flex justify-content-center'>
                            <div className=' rounded-2 shadow' style={{ background:`rgb(${color?.r},${color?.g},${color?.b})` , width:'70px' , height:'70px' }}></div>
                        </div>
                    </div>

                </div>
            ):(
                <>
                    <div style={{ width:'30px' , height:'18xp' , background:`rgba(${sketchPickerColor?.r},${sketchPickerColor?.g},${sketchPickerColor?.b},${sketchPickerColor?.a})` }}></div>
                    <div className='' onClick={()=>setSelect(true)}>اختر لون</div>
                </>
            )
        }
    </div>
  )
}

export default ColorSelection
