import * as THREE from "three";
import { CarInfo } from "../models/car";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";

export class Car {
  model!: THREE.Group<THREE.Object3DEventMap>;
  backgroundColor: THREE.Color = new THREE.Color("#000");

  constructor(
    public _carDetail: CarInfo,
    private _scene: THREE.Scene,
    private _postionY: number
  ) {}

  async loadModel(onComplete: Function | null = null) {
    const loader = new GLTFLoader();

    const gltf = await loader.loadAsync(`/assets/${this._carDetail.modelPath}`);
    this.model = gltf.scene;
    gltf.scene.scale.set(1.5, 1.5, 1.5);
    //   gltf.scene.receiveShadow = true;
    gltf.scene.position.set(0, -2, this._postionY);
    gltf.scene.rotation.copy(this._carDetail.rotation);
    gltf.scene.castShadow = true;
    this._scene.add(gltf.scene);
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
      }
      // child.receiveShadow = true;
      child.castShadow = true;
    });
    if (onComplete) onComplete();
  }
  changeModelColor(color: string) {
    const newColor = new THREE.Color(color);
    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name == this._carDetail.colorParts[0]) {
          gsap.to(this.backgroundColor, {
            r: newColor.r * 0.1,
            g: newColor.g * 0.1,
            b: newColor.b * 0.1,
            onUpdate: () => {
              child.material.color = new THREE.Color(this.backgroundColor);
              child.material.emissive = new THREE.Color(this.backgroundColor);
            },
            duration: 1,
          });
        }
      }
    });
  }
}
