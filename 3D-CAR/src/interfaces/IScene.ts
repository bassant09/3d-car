import { Car } from "../scripts/car"

export interface IScene{
     buildScene() :void 
     destroyScene() :void 
     getChosenCar() :Car
}