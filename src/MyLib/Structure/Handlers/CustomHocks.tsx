import { useRef } from "react"

export const useDefaultKey = ()=>{
    const button = useRef<HTMLButtonElement>(null)
    const defaultKeyHandling = (event: React.KeyboardEvent<HTMLInputElement>)=>{
        if(event.key === 'Enter'){
            button.current?.click()
        }
    }

    return {button , defaultKeyHandling}
}