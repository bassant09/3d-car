import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { IScene } from "../../interfaces/IScene";
import { World } from "../world";
import { Euler, Mesh } from "three";
import { CarInfo } from "../../models/car";
import { Car } from "../car";
import * as THREE from 'three';

export class HorrorSence implements IScene {
  readonly scenePath = "horor-scene.glb";
   chosenCar !:Car
  readonly carDetails: CarInfo = {
    name: "Chevrolet Corvette C7",
    modelPath: "mclaren_f1_1993_nfs2_edition_by_alex.ka..glb",
    positionY:0,
   rotation: new Euler(0, -Math.PI / 2, 0),
   colorParts:['Object_181'],
   description:'jjdji'


  };
  objects:THREE.Object3D[]=[]
  constructor(private _world: World) {}
  getChosenCar(): Car {
   return this.chosenCar
  }
  buildScene(): void {
    this.objects=[]

    this.LoadSence();
    this.setupSceneLights()
    this.setUpFog()
  }
  destroyScene(): void {
    this.objects.forEach(object=>{
this._world.scene.remove(object)
    })
  }
  LoadSence() {
    const loader = new GLTFLoader();
    loader.load(`/assets/${this.scenePath}`, (gltf) => {
      //gltf.scene.scale.set(1.5, 1.5, 1.5);
      gltf.scene.castShadow = true;
      this.objects.push(gltf.scene)
      this._world.scene.add(gltf.scene);
      gltf.scene.traverse((child) => {
        if (child instanceof Mesh) {
        }
        // child.receiveShadow = true;
        child.castShadow = true;
      });
    });
     this.chosenCar=new Car(this.carDetails,this._world.scene,0)
   this.chosenCar.loadModel().then(()=>{
    this.objects.push(this.chosenCar.model)

   })
  }
  setupSceneLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.objects.push(ambientLight)

    this._world.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      "rgb(255, 255, 255)",
      2
    );
    directionalLight.position.set(-50, 50, -50);
    directionalLight.castShadow = true;
    
    //const dhelper= new THREE.CameraHelper(directionalLight.shadow.camera)
 //   this.scene.add(directionalLight);
    //this.scene.add(dhelper);
    const pointLight=new THREE.PointLight('#ffc880',20)
    pointLight.position.set(0,3,0)
    pointLight.castShadow=true
    this._world.scene.add(pointLight)
    this.objects.push(pointLight)

    const LightpointLight=new THREE.PointLight('#ffc880',20)
    LightpointLight.position.set(0,3,-5)
    LightpointLight.castShadow=true
    this._world.scene.add(LightpointLight)
    this.objects.push(LightpointLight)

  
  }
  setUpFog() {
    const near = 4;
    const far = 30;
    const color = new THREE.Color("rgb(30,30,30)");
    this._world.scene.fog = new THREE.Fog(color, near, far);
  }

}
