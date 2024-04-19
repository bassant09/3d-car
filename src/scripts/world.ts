import gsap from "gsap";
import * as THREE from "three";
import {
  EffectComposer,
  OrbitControls,
  OutputPass,
  RenderPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import { EventDispatcher } from "./utilits/event-handler";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const colorBody = document.querySelector(".color-body");
const optionsBody = document.querySelector(".options") as HTMLElement;

export class World {
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.Camera;
  orbitCamera!: OrbitControls;
  renderScene!: RenderPass;
  composer!: EffectComposer;
  backgroundColor: THREE.Color = new THREE.Color("rgb(10,10,10)");
  onSelectColor = new EventDispatcher<string>();
  mainCameraPostion = new THREE.Vector3(12, 1, 0);
  sideCameraPostion = new THREE.Vector3(8, 3, 4);
  planes: THREE.Mesh[] = [];

  readonly mainColors = [
    "rgb(30, 30, 30)",
    "rgb(200, 200, 200)",
    "#6A452c",
    "rgb(200, 0, 0)",
    "rgb(200, 200, 0)",
    "rgb(0, 255, 0)",
  ];
  constructor() {
    this.setUpWorld();
    this.createColorCointaner();
    // selectBtn?.addEventListener("click", () => {
    //   this.focusModel();
    //   this.changeCarColor();
    // });
  }
  setUpWorld() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.scene = new THREE.Scene();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true;
    this.scene.background = new THREE.Color(this.backgroundColor);
    this.setUpCamera();
    this.setUpPlane();
    this.setUpVerticalPlane();
    this.setupSceneLights();
    this.setUpFog();
    this.setupPostProcessing();
    this.animate();
  }
  setUpCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.copy(this.mainCameraPostion);
    this.orbitCamera = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbitCamera.update();
    this.orbitCamera.enabled=false
  }
  toggleOrbitMove(){
    this.orbitCamera.enabled=!this.orbitCamera.enabled

  }
  changeCameraPos() {}
  setupSceneLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);

    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      "rgb(255, 255, 255)",
      2
    );
    directionalLight.castShadow = true;
    directionalLight.position.set(20, 20, -20);
    this.scene.add(directionalLight);

    //const dhelper= new THREE.CameraHelper(directionalLight.shadow.camera)
    //   this.scene.add(directionalLight);
    //this.scene.add(dhelper);
    // const pointLight=new THREE.PointLight('#ffc880',100)
    // pointLight.position.set(20,20,20)
    // pointLight.castShadow=true
    // this.scene.add(pointLight)
    // const LightpointLight=new THREE.PointLight('#ffc880',100)
    // LightpointLight.position.set(20,20,20)
    // LightpointLight.castShadow=true
    // this.scene.add(LightpointLight)
  }
  setUpFog() {
    const near = 4;
    const far = 30;
    const color = new THREE.Color("rgb(10,10,10)");
    this.scene.fog = new THREE.Fog(color, near, far);
  }
  setUpPlane() {
    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 100, 100),
      new THREE.MeshStandardMaterial({
        color: "rgb(20, 20, 20)",
        side: THREE.DoubleSide,
      })
    );
    planeMesh.receiveShadow = true;
    planeMesh.position.y = -2;
    planeMesh.rotation.x = -0.5 * Math.PI;
    this.scene.add(planeMesh);
    this.planes.push(planeMesh);
  }
  setUpVerticalPlane() {
    const planeMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 100, 100),
      new THREE.MeshStandardMaterial({
        color: "rgb(5, 5, 5)",
        side: THREE.DoubleSide,
      })
    );
    planeMesh.receiveShadow = true;
    planeMesh.position.x = -5;
    planeMesh.rotation.y = Math.PI / 2;
    this.scene.add(planeMesh);
    this.planes.push(planeMesh);
  }

  private animate() {
    this.orbitCamera.update();
    this.renderer.render(this.scene, this.camera);
    this.composer.render();
    requestAnimationFrame(() => this.animate());
  }
  focusModel() {
    gsap.to(this.camera.position, {
      x: 8,
      y: 1,
      z: 8,
      duration: 2,
      onUpdate: () => {
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      },
    });
  }

  createColorCointaner() {
    this.mainColors.forEach((element) => {
      const colorCointaner = document.createElement("div");
      colorCointaner.classList.add("color-coinatier");
      colorCointaner.style.backgroundColor = element;
      colorCointaner.addEventListener("click", () => {
        this.onSelectColor.next(element);
      });
      colorBody?.appendChild(colorCointaner);
    });
  }
  LoadSence(sence: string) {
    const loader = new GLTFLoader();
    loader.load(`/assets/${sence}`, (gltf) => {
      //gltf.scene.scale.set(1.5, 1.5, 1.5);
      gltf.scene.castShadow = true;
      this.scene.add(gltf.scene);
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
        }
        // child.receiveShadow = true;
        child.castShadow = true;
      });
    });
  }
  setupPostProcessing() {
    this.renderScene = new RenderPass(this.scene, this.camera);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.2,
      0.5,
      0.5
    );
    this.composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);
  }
  
  changeCarColor() {
    gsap.to(".cars-cointaner", {
      y: "-50%",
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(".line-horizontal", {
      width: "0px",
      duration: 0.5,
      opacity: 0,
      ease: "power2.out",
    });
    gsap.to(".left-arrow", {
      x: "-200%",
      duration: 0.5,
      opacity: 0,
      ease: "power2.out",
    });
    gsap.to(".right-arrow", {
      x: "200%",
      duration: 0.5,
      opacity: 0,
      ease: "power2.out",
    });
    gsap.to(".line-vertical", {
      height: "0px",
      duration: 0.5,
      opacity: 0,
      ease: "power2.out",
    });
    gsap.to("h1", { y: "-50%", opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(".select-btn", { opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(".color-body", {
      y: "100%",
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });
    if (optionsBody) {
      optionsBody.style.visibility = "visible";
      gsap.from(".options", {
        y: "100%",
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }
  changePlanesColor(color: string) {
    const newColor = new THREE.Color(color);
    gsap.to(this.backgroundColor, {
      r: newColor.r * 0.1,
      g: newColor.g * 0.1,
      b: newColor.b * 0.1,
      onUpdate: () => {
        this.scene.background = this.backgroundColor;
        this.scene.fog = new THREE.Fog(this.backgroundColor, 4, 30);

        this.planes.forEach((plane) => {
          const material = new THREE.MeshStandardMaterial({
            color: this.backgroundColor,
            side: THREE.DoubleSide,
          });
          plane.material = material;
          plane.receiveShadow = true;
        });
      },
      duration: 1,
    });
  }
 
}
