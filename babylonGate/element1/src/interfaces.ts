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
    box?: Mesh;
    light?: Light;
    plight? : PointLight;
    slight?: SpotLight;
    shadowGenerator?: ShadowGenerator;
    cylinder?: Mesh;
    nailHandle?: Mesh;
    nailBlade?: Mesh;
    needleHandle?: Mesh;
    needleBlade?: Mesh;
    needleThread?: Mesh;
    egg?: Mesh;
    sphere?: Mesh;
    ground?: Mesh;
    camera?: Camera;
}