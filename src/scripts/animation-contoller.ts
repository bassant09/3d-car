import gsap from "gsap";

export class AnimationController {
  gsapAnimationTo(target: any, toState: any) {
    gsap.to(target, toState);
  }
  gsapAnimationFrom(target: any, fromState: any) {
    gsap.from(target, fromState);
  }
//   gsapAnimationToWithComplete(
//     target: THREE.Vector3,
//     posZ: number,
//     duration: number,
//     completeTarget: any,
//     completeTargetFlag: boolean
//   ) {
//     gsap.to(target, {
//       z: posZ,
//       duration: duration,
//       ease: "circ.in",
//       onComplete: () => {
//         completeTarget = completeTargetFlag;
//       },
//     });
//   }
  gsapAnimateFromTo(target: string, fromState: any, toState: any) {
    gsap.fromTo(target, fromState, toState);
  }
}
