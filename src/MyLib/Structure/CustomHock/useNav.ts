import { useNavigate } from "react-router-dom"

export const useNav = ()=>{
    const navigator = useNavigate()
    const goTo = (path:string)=>{
        navigator(`/${path}`)
    }
    return goTo ;
}