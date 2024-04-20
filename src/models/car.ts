import { Euler } from "three"

export interface CarInfo{
    name:string 
    modelPath:string,
    positionY:number,
    rotation:Euler,
    colorParts:string[],
    description:string
}