import { Collider, PhysicsAggregate } from "@babylonjs/core";
import { SceneData } from "../interfaces";

// Collision callback function
const collideCB = (collision: {
  collider: { transformNode: { name: any } };
  collidedAgainst: { transformNode: { name: any } };
  point: any;
  distance: any;
  impulse: any;
  normal: any;
}): void => {
  //console.log(
  //  "collideCB",
  //  collision.collider.transformNode.name,
  //  collision.collidedAgainst.transformNode.name
  //);
};

const collideCB1 = (collision: {
  collider: { transformNode: { name: any } };
  collidedAgainst: { transformNode: { name: any } };
  point: any;
  distance: any;
  impulse: any;
  normal: any;
}): void => {
  //console.log(
  //  "collideCB1",
  //  collision.collider.transformNode.name,
  //  collision.collidedAgainst.transformNode.name
  //);
};

export function setupCollisions(sceneData: SceneData): void {
  // Collision filter groups
  const FILTER_GROUP_GROUND = 1;
  const FILTER_GROUP_PLATFORM = 2;
  const FILTER_GROUP_CUBE = 3;
  const FILTER_GROUP_OBSTACLE = 4;
  const FILTER_GROUP_PLAYER = 5;

  // Apply masks and collisions to physics agggregates
  if (sceneData.ground) {
    sceneData.ground.shape.filterMembershipMask = FILTER_GROUP_GROUND;
    sceneData.ground.shape.filterCollideMask = FILTER_GROUP_CUBE | FILTER_GROUP_PLAYER;
    sceneData.ground.body.getCollisionObservable().add(collideCB1);
  }

  if (sceneData.player) {
    sceneData.player.shape.filterMembershipMask = FILTER_GROUP_PLAYER;
    sceneData.player.shape.filterCollideMask = FILTER_GROUP_CUBE | FILTER_GROUP_GROUND | FILTER_GROUP_PLAYER;
    //sceneData.player.body.getCollisionObservable().add(collideCB);
  }

  for (let index = 0; index < sceneData.redmen.length; index++) { // iterates through all redmen aggregates and applies collision settings
    if (sceneData.redmen[index]) {
      sceneData.redmen[index].shape.filterMembershipMask = FILTER_GROUP_CUBE;
      sceneData.redmen[index].shape.filterCollideMask = FILTER_GROUP_CUBE | FILTER_GROUP_PLAYER;
      sceneData.redmen[index].body?.getEventMask();
      sceneData.redmen[index].body?.getCollisionObservable().add(collideCB);
      console.log("Collision settings applied to redman index:", index);
    }
  }
}