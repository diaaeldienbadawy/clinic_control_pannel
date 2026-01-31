import { Store } from "react-notifications-component";

export const Notify = (props:{type?:'success'|'danger'|'warning'|'default'|'info' , title?:string , body?:string , duration?:number})=>{
  try{  
  Store.addNotification({
        title: props.title || "Wonderful!",
        message: props.body || "have been sent succesfully",
        type: props.type || "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: props.duration || 5000,
          onScreen: true
        }
    });
  }catch{}
}