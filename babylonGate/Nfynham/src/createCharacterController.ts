import "@babylonjs/loaders/glTF/2.0";
import { SceneLoader, TransformNode, Mesh, AbstractMesh } from "@babylonjs/core";

import {
  Scene,
  Vector3,
  MeshBuilder,
  PhysicsCharacterController,
  Quaternion,
  CharacterSupportedState,
  KeyboardEventTypes,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";

export async function createCharacterController(scene: Scene): Promise<{ displayCapsule: Mesh; characterController: PhysicsCharacterController }> {
  // Character state machine
  let characterState = "ON_GROUND";
  const inAirSpeed = 8.0;
  const onGroundSpeed = 10;
  const jumpHeight = 1.5;
  const characterGravity = new Vector3(0, -18, 0);
  
  // Input tracking
  let keyInput = new Vector3(0, 0, 0);
  let wantJump = false;
  
  // Character orientation
  let characterOrientation = Quaternion.Identity();
  let forwardLocalSpace = new Vector3(0, 0, 1);

  // Create visual capsule mesh
  const h = 1.8;
  const r = 0.6;
  let displayCapsule = MeshBuilder.CreateCapsule(
    "CharacterDisplay",
    { height: h, radius: r },
    scene
  );
  displayCapsule.position = new Vector3(0, h / 2, 0);

  // make the capsule invisible so player model can be seen, will work as a collider
  displayCapsule.isVisible = false;

  // create physics character controller for capsule
  let characterController = new PhysicsCharacterController(
    displayCapsule.position.clone(),
    { capsuleHeight: h, capsuleRadius: r },
    scene
  );

  // imports the player mesh (through "obsolete" means)
  const result = await SceneLoader.ImportMeshAsync("", "./assets/hunter/", "HunterBabylonJS.gltf", scene);
  
  // creates a single transform root to hold all imported meshes
  const visualRoot = new TransformNode("characterVisualRoot", scene);
  result.meshes.forEach((m: AbstractMesh) => {
    
    // avoid re-parenting the capsule itself if it was included
    if (m !== displayCapsule) {
      (m as Mesh).setParent(visualRoot);
    }
  });

  // parent the visual root to the capsule so it moves with the physics controller
  visualRoot.setParent(displayCapsule);

  // reset position and rotation to match parent capsule orientation
  visualRoot.position = Vector3.Zero();
  visualRoot.rotation = Vector3.Zero();
  // If the model's pivot is off, you can center on bounding box:
  visualRoot.position.y -= 1;

  // Compute desired velocity based on input and state
  const getDesiredVelocity = function (
    deltaTime: number,
    supportInfo: {
      supportedState: CharacterSupportedState;
      averageSurfaceNormal: Vector3;
      averageSurfaceVelocity: Vector3;
    },
    currentVelocity: Vector3
  ): Vector3 {
    // Update state
    if (characterState === "ON_GROUND" && supportInfo.supportedState !== CharacterSupportedState.SUPPORTED) {
      characterState = "IN_AIR";
    } else if (characterState === "IN_AIR" && supportInfo.supportedState === CharacterSupportedState.SUPPORTED) {
      characterState = "ON_GROUND";
    }

    // Check for jump transition
    if (characterState === "ON_GROUND" && wantJump) {
      characterState = "START_JUMP";
    } else if (characterState === "START_JUMP") {
      characterState = "IN_AIR";
    }

    let upWorld = characterGravity.normalizeToNew();
    upWorld.scaleInPlace(-1.0);
    let forwardWorld = forwardLocalSpace.applyRotationQuaternion(characterOrientation);

    if (characterState === "IN_AIR") {
      let desiredVelocity = keyInput
        .scale(inAirSpeed)
        .applyRotationQuaternion(characterOrientation);
      let outputVelocity = characterController.calculateMovement(
        deltaTime,
        forwardWorld,
        upWorld,
        currentVelocity,
        Vector3.ZeroReadOnly,
        desiredVelocity,
        upWorld
      );
      // Restore vertical component and apply gravity
      outputVelocity.addInPlace(upWorld.scale(-outputVelocity.dot(upWorld)));
      outputVelocity.addInPlace(upWorld.scale(currentVelocity.dot(upWorld)));
      outputVelocity.addInPlace(characterGravity.scale(deltaTime));
      return outputVelocity;
    } else if (characterState === "ON_GROUND") {
      let desiredVelocity = keyInput
        .scale(onGroundSpeed)
        .applyRotationQuaternion(characterOrientation);

      let outputVelocity = characterController.calculateMovement(
        deltaTime,
        forwardWorld,
        supportInfo.averageSurfaceNormal,
        currentVelocity,
        supportInfo.averageSurfaceVelocity,
        desiredVelocity,
        upWorld
      );
      // Project velocity onto ground plane
      outputVelocity.subtractInPlace(supportInfo.averageSurfaceVelocity);
      let inv1k = 1e-3;
      if (outputVelocity.dot(upWorld) > inv1k) {
        let velLen = outputVelocity.length();
        outputVelocity.normalizeFromLength(velLen);
        let horizLen = velLen / supportInfo.averageSurfaceNormal.dot(upWorld);
        let c = supportInfo.averageSurfaceNormal.cross(outputVelocity);
        outputVelocity = c.cross(upWorld);
        outputVelocity.scaleInPlace(horizLen);
      }
      outputVelocity.addInPlace(supportInfo.averageSurfaceVelocity);
      return outputVelocity;
    } else if (characterState === "START_JUMP") {
      let u = Math.sqrt(2 * characterGravity.length() * jumpHeight);
      let curRelVel = currentVelocity.dot(upWorld);
      return currentVelocity.add(upWorld.scale(u - curRelVel));
    }
    return Vector3.Zero();
  };

  // Sync visual mesh with physics controller every frame
  scene.onBeforeRenderObservable.add(() => {
    displayCapsule.position.copyFrom(characterController.getPosition());
  });

  // Update physics each frame
  scene.onAfterPhysicsObservable?.add(() => {
    if (scene.deltaTime === undefined) return;
    let dt = scene.deltaTime / 1000.0;
    if (dt === 0) return;

    let down = new Vector3(0, -1, 0);
    let support = characterController.checkSupport(dt, down);

    let desiredLinearVelocity = getDesiredVelocity(
      dt,
      support,
      characterController.getVelocity()
    );
    characterController.setVelocity(desiredLinearVelocity);
    characterController.integrate(dt, support, characterGravity);
  });

  // Keyboard input handler
  scene.onKeyboardObservable.add((kbInfo) => {
    const key = kbInfo.event.key;
    
    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        if (key === "w" || key === "ArrowUp") {
          keyInput.z = 1;
          displayCapsule.rotation.y = (2 * Math.PI) / 2;
        } else if (key === "s" || key === "ArrowDown") {
          keyInput.z = -1;
          displayCapsule.rotation.y = (0 * Math.PI) / 2;
        } else if (key === "a" || key === "ArrowLeft") {
          keyInput.x = -1;
          displayCapsule.rotation.y = (1 * Math.PI) / 2;
        } else if (key === "d" || key === "ArrowRight") {
          keyInput.x = 1;
          displayCapsule.rotation.y = (3 * Math.PI) / 2;
        } else if (key === " ") {
          wantJump = true;
        }
        break;

      case KeyboardEventTypes.KEYUP:
        if (key === "w" || key === "s" || key === "ArrowUp" || key === "ArrowDown") {
          keyInput.z = 0;
        }
        if (key === "a" || key === "d" || key === "ArrowLeft" || key === "ArrowRight") {
          keyInput.x = 0;
        }
        if (key === " ") {
          wantJump = false;
        }
        break;
    }
    console.log(keyInput);
  });

  return { displayCapsule, characterController };
}
