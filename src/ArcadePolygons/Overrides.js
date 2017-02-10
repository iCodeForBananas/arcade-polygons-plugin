/**
 * A static class with override methods for Phaser's tilemap collisions and tile
 * neighbour checks.
 *
 * @static
 * @class Phaser.Plugin.ArcadeSlopes.Override
 */
Phaser.Plugin.ArcadePolygons.Overrides = {}

/**
 * Collide a sprite against a tile map layer.
 *
 * This is used to override Phaser.Physics.Arcade.collideSpriteVsTilemapLayer().
 *
 * @override Phaser.Physics.Arcade#collideSpriteVsTilemapLayer
 * @method Phaser.Plugin.ArcadeSlopes.Overrides#collideSpriteVsTilemapLayer
 * @param  {Phaser.Sprite}       sprite           - The sprite to check.
 * @param  {Phaser.TilemapLayer} tilemapLayer     - The tilemap layer to check.
 * @param  {function}            collideCallback  - An optional collision callback.
 * @param  {function}            processCallback  - An optional overlap processing callback.
 * @param  {object}              callbackContext  - The context in which to run the callbacks.
 * @param  {boolean}             overlapOnly      - Whether to only check for an overlap.
 * @return {boolean}                              - Whether a collision occurred.
 */
Phaser.Plugin.ArcadePolygons.Overrides.collideSpriteVsGroup = function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly) {
	if (!sprite.body) {
		return false;
	}

  if (!sprite.body.sat) {
    console.error('Non polygon object!')
  }

  /**
  * Some data populated by the update() method for use in the render()
  * method.
  *
  * @type {object<array>}
  */
  this.debug = {
    vectors: [],
    normals: []
  }

  /**
   * Some feature values we can use throughout our game state.
   *
   * @type {object}
   */
  this.features = {
    debug: 0,
    speed: 1000,
    bounce: 0,
    gravity: 500,
    friction: 0,
    slowMotion: 1
  }

  var body = sprite.body

  // Update the player box position
  body.sat.polygon.pos.x = body.x; // SAT allows us to set polygon
  body.sat.polygon.pos.y = body.y; // position properties directly

  // Lazily loop over all the polygons. In reality you'd use a quad
  // tree or some broad phase of collision detection so that you
  // don't have to test against everything, but we don't need
  // to get into optimisation here as this is just a test.
  for (var i in group.children) {
    var polygon = group.children[i];

    var response = new SAT.Response();
    var collision = SAT.testPolygonPolygon(body.sat.polygon, polygon.body.sat.polygon, response);

    // Our collision test responded positive, so let's resolve it
    if (collision) {
      // Here's our overlap vector - let's invert it so it faces
      // out of the collision surface
      var overlapV = response.overlapV.clone().scale(-1);

      // Then add it to the player's position to resolve the
      // collision!
      body.position.x += overlapV.x;
      body.position.y += overlapV.y;

      // Let's update the SAT polygon too for any further polygons
      body.sat.polygon.pos.x = body.position.x;
      body.sat.polygon.pos.y = body.position.y;

      /**
       * And now, let's experiment with - goodness me - velocity!
       */

      var velocity = new SAT.V(body.velocity.x, body.velocity.y);

      // We need to flip our overlap normal, SAT gives it to us
      // facing inwards to the collision and we need it facing out
      var overlapN = response.overlapN.clone().scale(-1);

      // Project our velocity onto the overlap normal
      var velocityN = velocity.clone().projectN(overlapN);

      // Then work out the surface velocity
      var velocityT = velocity.clone().sub(velocityN);

      // Scale our normal velocity with a bounce coefficient
      // Ziggity, biggity, hi! https://youtu.be/Yc8bzl6dqQI
      var bounce = velocityN.clone().scale(-this.features.bounce);

      // And scale a friction coefficient to the surface velocity
      var friction = velocityT.clone().scale(1 - this.features.friction);

      // And finally add them together for our new velocity!
      var newVelocity = friction.clone().add(bounce);

      // Set the new velocity on our physics body
      body.velocity.x = newVelocity.x;
      body.velocity.y = newVelocity.y;

      // If debugging is enabled, let's store some of our vectors.
      // This is why we've declared so many variables above.
      // Otherwise, we wouldn't need to.
      if (this.features.debug) {
        velocity.name    = 'velocity';
        overlapV.name    = 'overlapV';
        overlapN.name    = 'overlapN';
        velocityN.name   = 'velocityN';
        velocityT.name   = 'velocityT';
        bounce.name      = 'bounce';
        friction.name    = 'friction';
        newVelocity.name = 'newVelocity';

        this.debug.vectors.push(
          velocity,
          overlapN,
          velocityN,
          velocityT,
          bounce,
          friction,
          newVelocity
        );

        // If detailed debugging is enabled, let's print the
        // vectors as lines on the screen!
        if (this.features.debug > 1) {
          overlapN.colour = '#333';
          bounce.colour   = '#25f';
          friction.colour = '#f55';
          newVelocity.colour = '#5f5';

          //
          overlapN.scale(50);

          this.debug.normals.push(
            overlapN, bounce, friction, newVelocity
          );
        }
      }
    }
  }
}
