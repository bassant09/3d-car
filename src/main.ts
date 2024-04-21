import "./style.scss";
import * as THREE from "three";
import { World } from "./scripts/world";
import { Car } from "./scripts/car";
import { CarInfo } from "./models/car";
import gsap from "gsap";
import { Euler } from "three";
import { AnimationController } from "./scripts/animation-contoller";

const optionsBody = document.querySelector(".options") as HTMLElement;
const selectBtn = document.querySelector(".select-btn");
const carName = document.querySelector("h1");
const carDescription = document.querySelector(".car-description-data ");
const carNameDesc = document.querySelector(".car-name");
let curIndex = 0;
let carModels: Car[] = [];
const carDetails: CarInfo[] = [
  {
    name: "Chevrolet Corvette C7",
    modelPath: "mclaren_f1_1993_nfs2_edition_by_alex.ka..glb",
    positionY: 0,
    rotation: new Euler(0, 0, 0),
    colorParts: ["Object_7"],
    description:
      "An American icon of performance. With sleek lines, a powerful engine, and precision engineering, it delivers an exhilarating driving experience. From the track to the open road, it commands attention and thrills at every turn. Unleash the legend.",
  },
  {
    name: "Chevrolet Corvette C8",
    modelPath: "chevrolet_corvett_c8.gltf",
    positionY: 0,
    rotation: new Euler(0, Math.PI, 0),
    colorParts: ["Object_181"],
    description:
      "Redefining performance with sleek design, powerful engine, and advanced tech. From aggressive stance to refined interior, it delivers unmatched thrills on road or track. Unleash the legend",
  },
  {
    name: "BMW",
    modelPath: "bmw_m4_csl_2023 (1).glb",
    positionY: 0,
    rotation: new Euler(0, 0, 0),
    colorParts: ["Object_181"],
    description:"Where luxury meets performance, creating exhilarating driving experiences. With iconic design and cutting-edge technology, BMW delivers precision engineering and driving pleasure. Elevating every journey, whether city streets or winding roads"
  },
];
var animation: boolean = false;
const world = new World();
const animationController = new AnimationController();
let chosenModel: Car;
world.onSelectColor.subscribe((color) => {
  chosenModel.changeModelColor(color);
  world.changePlanesColor(color);
});

function addCarsName() {
  const carContainer = document.querySelector(".cars-cointaner");
  carDetails.forEach((car, index) => {
    const carNameElement = document.createElement("p");
    if (index == 0) carNameElement.classList.add("p-selected");
    carNameElement.textContent = car.name;
    const carModel = new Car(car, world.scene, car.positionY);
    carModel.loadModel(() => {
      if (curIndex != index) {
        carModel.model.visible = false;
      }
    });
    carModels.push(carModel);
    chosenModel = carModels[0];
    setChosenCarData(chosenModel);

    if (carNameDesc) carNameDesc;
    carNameElement.addEventListener("click", () => {
      if (animation) return;
      animation = true;
      const selectedCars = document.querySelectorAll(".p-selected");
      selectedCars.forEach((car) => {
        car.classList.remove("p-selected");
      });
      carNameElement.classList.add("p-selected");
      if (curIndex == index) return;
      //changeCar(curIndex,index)
      animationController.gsapAnimationTo(world.camera.position, {
        x: 0,
        y: 10,
        z: 3,
        ease: "power1.inOut",
        duration: 2,
      });
      animationController.gsapAnimationTo(world.camera.position, {
        x: world.mainCameraPostion.x,
        y: world.mainCameraPostion.y,
        z: world.mainCameraPostion.z,
        ease: "power1.inOut",
        duration: 2,
        delay: 4,
      });
      let prevIndex = curIndex;
      animationController.gsapAnimationTo(
        carModels[prevIndex].model.position,
        {
          z:50,
          duration:4,
          ease: "circ.in",
          onComplete: () => {
            carModels[prevIndex].model.visible=false
          },
        }
      
      );
      curIndex = index;
      carModels[curIndex].model.visible = true;
      chosenModel = carModels[curIndex];
      setChosenCarData(chosenModel);
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
      setTimeout(() => {
        animation = false;
      }, 5000);
    });
    if (carContainer) carContainer.appendChild(carNameElement);
  });
}
function carContainerAnimation() {
  if (animation) return;
  animation = true;
  animationController.gsapAnimateFromTo(
    ".cars-cointaner",
    {
      x: "50%",
      y: 0,
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
    }
  );
  animationController.gsapAnimationTo(".line-horizontal", {
    width: "300px",
    opacity: 1,
    duration: 1.5,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".line-vertical", {
    height: "200px",
    opacity: 1,
    duration: 1.5,
    ease: "power2.out",
  });
  animationController.gsapAnimateFromTo(
    ".left-arrow",
    {
      x: "200%",
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
    }
  );
  animationController.gsapAnimateFromTo(
    ".right-arrow",
    {
      x: "-200%",
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
    }
  );
  animationController.gsapAnimateFromTo(
    ".right-arrow",
    {
      x: "-200%",
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
    }
  );
  animationController.gsapAnimateFromTo(
    ".select-btn",
    {
      y: "100%",
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
    }
  );
  animationController.gsapAnimateFromTo(
    "h1",
    {
      y: "100%",
      opacity: 0,
      duration: 1.5,
      ease: "power2.out",
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
    }
  );
  animationController.gsapAnimateFromTo(
    ".hero-details",
    {
      opacity: 0,
      x: "20%",
      duration: 1,
      ease: "power2.out",
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
    }
  );
  animationController.gsapAnimationTo(".color-body", {
    y: "-100%",
    opacity: 0,
    duration: 0.3,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".options", {
    y: "-100%",
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".car-details", {
    opacity: 0,
  });
  animationController.gsapAnimationFrom(".car-hero", {
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    delay: 1,
    stagger: 0.3,
    x: "20%",
  });
  setTimeout(() => {
    animation = false;
  }, 1000);
  if (optionsBody) optionsBody.style.visibility = "hidden";
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
  if (animation) return;
  animation = true;
  animationController.gsapAnimationTo(".cars-cointaner", {
    y: "-50%",
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".line-horizontal", {
    width: "0px",
    duration: 0.5,
    opacity: 0,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".line-vertical", {
    height: "0px",
    duration: 0.5,
    opacity: 0,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".left-arrow", {
    x: "-200%",
    duration: 0.5,
    opacity: 0,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".right-arrow", {
    x: "200%",
    duration: 0.5,
    opacity: 0,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo("h1", {
    y: "-50%",
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".select-btn", {
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".color-body", {
    y: "100%",
    opacity: 1,
    duration: 1,
    ease: "power2.out",
  });
  animationController.gsapAnimationTo(".hero-details", {
    opacity: 0,
    x: "20%",
    duration: 1,
    ease: "power2.out",
  });
  animationController.gsapAnimateFromTo(
    ".car-details",
    {
      opacity: 0,
      x: "30%",
      duration: 1,
      ease: "power2.out",
    },
    {
      opacity: 1,
      x: "0%",
      duration: 1,
      ease: "power2.out",
    }
  );
  if (optionsBody) {
    optionsBody.style.visibility = "visible";
    animationController.gsapAnimationFrom(".options", {
      y: "100%",
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  }
  setTimeout(() => {
    animation = false;
  }, 1000);
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
  chosenModel = carModels[curIndex];
  setChosenCarData(chosenModel);

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
const orbitBtn = document.querySelector(".orbit-container");
orbitBtn?.addEventListener("click", () => {
  world.toggleOrbitMove();
  // document.body.style.cursor='move'
});
const doneBtn = document.querySelector(".done-btn");
doneBtn?.addEventListener("click", () => {
  unFocusModel();
  carContainerAnimation();
});
function unFocusModel() {
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
function setChosenCarData(car: Car) {
  if (carName) carName.textContent = car._carDetail.name;
  if (carNameDesc) carNameDesc.textContent = car._carDetail.name;
  if (carDescription) carDescription.textContent = car._carDetail.description;
}
addCarsName();
carContainerAnimation();
ArrowClick();
selectBtn?.addEventListener("click", () => {
  focusModel();
  changeCarColor();
});
