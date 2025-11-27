import {
    Scene,
    ArcRotateCamera,
    AssetsManager,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Mesh,
    Camera,
    Engine,
    HavokPlugin,
    PhysicsCharacterController,
    Quaternion,
    CharacterSupportedState,
    KeyboardEventTypes,
    PhysicsAggregate,
    PhysicsShapeType,
    Light,
    PointLight,
    ShadowGenerator,
    StandardMaterial,
    Color3,
    Texture,
  } from "@babylonjs/core";

export interface SceneData {
    scene: Scene;
    light?: Light;
    plight? : PointLight;
    shadowGenerator?: ShadowGenerator;
    ground?: Mesh;
    camera?: Camera;
}