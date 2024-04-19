import "./style.scss";
import * as THREE from "three";
import { World } from "./scripts/world";
import { Car } from "./scripts/car";
import { CarInfo } from "./models/car";
import gsap from "gsap";

// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.shadowMap.enabled=true;

// const controls = new OrbitControls(camera, renderer.domElement);

// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 3, 3, 3);
// const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// cube.castShadow=true;
// cube.receiveShadow=true;
// cube.position.y= 3;

//  //scene.add( cube );

// camera.position.z = 5;
// camera.position.x = 1;
// camera.position.y= 1;

// controls.update()

// const planeGeometry = new THREE.PlaneGeometry(30,30)
// const planeMaterial = new THREE.MeshStandardMaterial( { color:'rgb(50, 50, 50)' , side:THREE.DoubleSide} );
// const planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
// planeMesh.receiveShadow = true;

// const gridHelper=new THREE.GridHelper(30);
// scene.add(gridHelper)
// scene.add(planeMesh)
// planeMesh.rotation.x=-0.5 * Math.PI
// const loader = new GLTFLoader();

//   loader.load('/assets/bmw_m4_csl_2023.glb', function (gltf) {
//     gltf.scene.scale.set(1.5, 1.5, 1.5);
//     gltf.scene.receiveShadow  = true;
//   gltf.scene.castShadow = true;
//       scene.add(gltf.scene);
//       gltf.scene.traverse((child) => {
//         if (child instanceof THREE.Mesh) {

//         }
//         child.receiveShadow = true;
//         child.castShadow = true;

//     });
//   }, );

// function animate() {
//     requestAnimationFrame(animate);
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     renderer.render(scene, camera);
// }
//  function setupSceneLights() {
//   const ambientLight = new THREE.AmbientLight(0xffffff, 3);

//   scene.add(ambientLight);

//   const directionalLight = new THREE.DirectionalLight(
//       "rgb(255, 255, 255)",
//     5
//   );
//   directionalLight.position.set(-50, 50, -50);
//   directionalLight.castShadow = true;
//   const dhelper= new THREE.CameraHelper(directionalLight.shadow.camera)
//   scene.add(directionalLight);
//   scene.add(dhelper);

// }
// setupSceneLights()

// animate()
const carDetails: CarInfo[] = [
  {
    name: "Chevrolet Corvette C7",
    modelPath: "mclaren_f1_1993_nfs2_edition_by_alex.ka..glb",
    positionY: 0,
  },
  {
    name: "BMW",
    modelPath: "bmw_m4_csl_2023 (1).glb",
    positionY: 0,
  },
];
const world = new World();
let chosenModel: Car;
const optionsBody = document.querySelector(".options") as HTMLElement;
const selectBtn = document.querySelector(".select-btn");

// const carDetails: IScene[] = [  new HorrorSence(world),new GalaxySence(world)];
// carDetails[0].buildScene();
// world.onSelectColor.subscribe((color) => {
//   carDetails.forEach(car=>{
//     car.getChosenCar().changeModelColor(color);

//   })
// });
// let activeScene = carDetails[0];
world.onSelectColor.subscribe((color) => {
  chosenModel.changeModelColor(color); 
  world.changePlanesColor(color)
});
let curIndex = 0;
let carModels: Car[] = [];
function addCarsName() {
  const carContainer = document.querySelector(".cars-cointaner");
  carDetails.forEach((car, index) => {
    const carNameElement = document.createElement("p");
    carNameElement.textContent = car.name;
    const carModel = new Car(car, world.scene, car.positionY);
    carModel.loadModel(() => {
      if (curIndex != index) {
        carModel.model.visible = false;
      }
    });
    carModels.push(carModel);
    chosenModel = carModels[0];

    carNameElement.addEventListener("click", () => {
    debugger;
      if(animation) return
      animation=true
      const selectedCars= document.querySelectorAll('.p-selected')
      selectedCars.forEach(car=>{
        car.classList.remove('p-selected')
      })
      carNameElement.classList.add('p-selected')
      if (curIndex == index) return;
      //changeCar(curIndex,index)
      gsap.to(world.camera.position, {
        x: 0,
        y: 10,
        z: 3,
        ease: "power1.inOut",
        duration: 2,
      });
      gsap.to(world.camera.position, {
        x: world.mainCameraPostion.x,
        y: world.mainCameraPostion.y,
        z: world.mainCameraPostion.z,
        ease: "power1.inOut",
        duration: 2,
        delay: 4,
      });
      let prevIndex = curIndex;
      gsap.to(carModels[prevIndex].model.position, {
        z: 50,
        duration: 4,
        ease: "circ.in",
        onComplete: () => {
          carModels[prevIndex].model.visible = false;
        },
      } 
     
     
    );
      //  carModels[curIndex].model.visible=false
      curIndex = index;
      carModels[curIndex].model.visible = true;
      chosenModel = carModels[curIndex];
      debugger;

      gsap.fromTo(
        carModels[curIndex].model.position,
        {
          z: -80,
          onStart: () => {
            debugger;
            carModels[curIndex].model.visible = true;
          },
          delay: 2,
        },
        { z: 0, duration: 4, ease: "circ.out" }
      );
      setTimeout(()=>{
        animation=false  
      },5000) 
    });
    if (carContainer) carContainer.appendChild(carNameElement); 
   
  });
}
var animation :boolean = false

function carContainerAnimation() {
  if(animation) return;
  animation=true
  gsap.fromTo(".cars-cointaner", {
    x: "50%",
    y:0,
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
  },{
    opacity:1,
    x:0,
    y:0
  });
  gsap.to(".line-horizontal", {
    width: "300px",
    opacity:1,
    duration: 1.5,
    ease: "power2.out",
  });
  gsap.to(".line-vertical", {
    height: "200px",
    opacity:1,
    duration: 1.5,
    ease: "power2.out",
  });
  gsap.fromTo(".left-arrow", {
    x: "200%",
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
  },{
    opacity:1,
    x:0,
    y:0
  });
  gsap.fromTo(".right-arrow", {
    x: "-200%",
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
  },{
    opacity:1,
    x:0,
    y:0
  });
  gsap.fromTo(".select-btn", {
    y: "100%",
    opacity: 0,
    duration: 1.5,
    ease: "power2.out",
  },{
    opacity:1,
    x:0,
    y:0
  });
  gsap.fromTo("h1", { y: "100%", opacity: 0, duration: 1.5, ease: "power2.out" },{
    opacity:1,
    x:0,
    y:0
  });
  gsap.fromTo("h1", { y: "100%", opacity: 0, duration: 1.5, ease: "power2.out" },{
    opacity:1,
    x:0,
    y:0
  });
  gsap.to(".color-body", {
    y: "-100%",
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
  });
    gsap.to(".options", {
      y: "-100%",
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.fromTo(".hero-details ",{
   opacity:0,
   x:"20%",
   duration:1,
   ease: "power2.out",
    },{opacity:1,x:0,y:0})
    gsap.from(".car-hero",{
      opacity:0,
      duration:1,
      ease: "power2.out",
      delay:1,
      stagger:0.3,
      x:"20%",
       }) 
       gsap.to(".car-details",{
        opacity:0
 } )
   setTimeout(()=>{
    animation=false
   },1000) 
    if (optionsBody) {
      optionsBody.style.visibility = "hidden";
    }
} 
function focusModel() {
  gsap.to(world.camera.position, {
    x: 8,
    y: 1,
    z: 8,
    duration: 2,
    onUpdate: () => {
      world.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
  });
}
function changeCarColor() {
  debugger;
  if(animation) return
  animation=true
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
  gsap.to(".hero-details ",{
    opacity:0,
    x:"20%",
    duration:1,
    ease: "power2.out",
     })
     gsap.fromTo(".car-details ",{
      opacity:0,
      x:"30%",
      duration:1,
      ease: "power2.out",
       } ,{
        opacity:1,
        x:"0%",
        duration:1,
        ease: "power2.out",
       })
  setTimeout(()=>{
    animation=false
   },1000) 
}

function ArrowClick() {
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      changeCar(1);
    });
  }
  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      changeCar(-1);
    });
  }
}
function changeCar(movement: number) {
  if (
    (curIndex == 0 && movement == -1) ||
    (curIndex == carModels.length - 1 && movement == 1)
  )
    return;
  gsap.to(world.camera.position, {
    x: 0,
    y: 10,
    z: 3,
    ease: "power1.inOut",
    duration: 2,
  });
  gsap.to(world.camera.position, {
    x: world.mainCameraPostion.x,
    y: world.mainCameraPostion.y,
    z: world.mainCameraPostion.z,
    ease: "power1.inOut",
    duration: 2,
    delay: 4,
  });
  let prevIndex = curIndex;
  gsap.to(carModels[prevIndex].model.position, {
    z: 50,
    duration: 4,
    ease: "circ.in",
    onComplete: () => {
      carModels[prevIndex].model.visible = false;
    },
  });
  curIndex += movement;
  debugger;
  carModels[curIndex].model.visible = true;

  gsap.fromTo(
    carModels[curIndex].model.position,
    {
      z: -80,
      onStart: () => {
        debugger;
        carModels[curIndex].model.visible = true;
      },
      delay: 2,
    },
    { z: 0, duration: 4, ease: "circ.out" }
  );
}
const orbitBtn=document.querySelector('.orbit-container');
orbitBtn?.addEventListener("click",()=>{
  world.toggleOrbitMove()
})
const doneBtn=document.querySelector('.done-btn');
doneBtn?.addEventListener("click",()=>{
  unFocusModel()
  carContainerAnimation();


})
function unFocusModel(){
  gsap.to(world.camera.position, {
    x: world.mainCameraPostion.x,
    y: world.mainCameraPostion.y,
    z: world.mainCameraPostion.z,
    duration: 2,
    onUpdate: () => {
      world.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
  });
}
addCarsName();
carContainerAnimation();
ArrowClick();
selectBtn?.addEventListener("click", () => {
  focusModel();
  changeCarColor();
});
// world.LoadSence('horor-scene.glb')
