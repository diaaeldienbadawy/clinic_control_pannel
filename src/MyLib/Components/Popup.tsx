import React, { Children } from 'react'
import { InterActive, useVM } from '../../MyLib/Structure/Utilities/ViewModelStructure';
import { Globals } from '../../MyLib/Structure/Globals/GlobalObs';

export const Popup = () => {
    const control = useVM<PopupVM>(Globals.popup)

  return (
    <>
      <div
        className= {`${control.isOpen?'d-flex':'d-none'}  glass-effect-I justify-content-center w-100 h-100 overflow-auto p-2`}
        style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", 
            zIndex:5,
          background:'rgba(0, 0, 0, 0.2)',
        }}
      >
        <div
            className=' my-auto p-2 rounded-3 '
            style={{ 
                display:'grid',
                gridTemplateRows:'auto 1fr',
                minWidth:'300px',
                minHeight:'200px',
                boxShadow: "0 0px 12px rgba(0, 0, 0, 0.3)",
                background:'white'
             }}
        >
            <div className='d-flex'>
                <h3 className='w-100 text-center'>{control.title}</h3>
                <span className='material-symbols-outlined btn-delete c-pointer' onClick={()=>control.close()}>close</span>
            </div>
            <div className='text-center p-md-2 h-100'>
                {control.content}
            </div>
        </div>
      </div>
    </>
  )
}

export class PopupVM extends InterActive{
    
    private _title : string = '';
    public get title() : string {
        return this._title;
    }
    public set title(v : string) {
        this._title = v;
        this.update()
    }

    
    private _isOpen : boolean = false;
    public get isOpen() : boolean {
        return this._isOpen;
    }
    public set isOpen(v : boolean) {
        this._isOpen = v;
        this.update()
    }

    
    private _closeButton : boolean = false;
    public get closeButton() : boolean {
        return this._closeButton;
    }
    public set closeButton(v : boolean) {
        this._closeButton = v;
        this.update()
    }
    

    
    private _onClose : ()=>void = ()=>{};
    public get onClose() : ()=>void {
        return this._onClose;
    }
    public set onClose(v : ()=>void) {
        this._onClose = v;
        this.update()
    }
    
    
    private _onAccept : undefined|(()=>void) = undefined;
    public get onAccept() : undefined|(()=>void) {
        return this._onAccept;
    }
    public set onAccept(v : undefined|(()=>void)) {
        this._onAccept = v;
        this.update()
    }
    
    
    private _content : React.ReactNode;
    public get content() : React.ReactNode {
        return this._content;
    }
    public set content(v : React.ReactNode) {
        this._content = v;
        this.update()
    }
    
    public open(props:{title?:string, onAccept?:()=>void , content?:React.ReactNode, hasCloseButton?:boolean}) {
        this._title = props.title??''
        if(props.hasCloseButton == undefined)this._closeButton = false
        else this._closeButton = props.hasCloseButton
        this._onAccept = props.onAccept
        this._content = props.content
        this._isOpen = true 
        this.update()
    }

    public accept(){
        if(this._onAccept)this._onAccept()
        this._isOpen = false 
        this.update()
    }
    public close(){
        this._title ='تنبيه'
        this._onAccept = undefined
        this._content = <></>
        this._isOpen = false
        this.update()
    }
}

