import { ReactElement } from "react"
import { InterActive } from "../../../MyLib/Structure/Utilities/ViewModelStructure";

export class AppBodyVM extends InterActive{
  private element:ReactElement = <div></div>

  public get Element():ReactElement { return this.element }

  public set Element(value:ReactElement){ this.element = value; this.update() }
}