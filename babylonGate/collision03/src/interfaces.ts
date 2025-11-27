import {
  Scene,
  Sound,
  Mesh,
  HemisphericLight,
  Camera,
  ISceneLoaderAsyncResult,
} from "@babylonjs/core";

export interface SceneData {
  scene: Scene;
  //audio: Sound;
  lightHemispheric: HemisphericLight;
  camera: Camera;
  player: Promise<void | ISceneLoaderAsyncResult>;
  box1: Mesh;
  box2: Mesh;
  ground: Mesh;
}