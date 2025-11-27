import {
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    PointLight,
    SpotLight,
    ShadowGenerator,
    MeshBuilder,
    Mesh,
    Light,
    Camera,
    Engine,
    StandardMaterial,
    Color3,
    Texture,
    ThinScreenSpaceCurvaturePostProcess,
    DirectionalLight,
    CreateGround,
  } from "@babylonjs/core";

export interface SceneData {
    scene: Scene;
    light?: Light;
    plight? : PointLight;
    shadowGenerator?: ShadowGenerator;
    ground?: Mesh;
    camera?: Camera;
}