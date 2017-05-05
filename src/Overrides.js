const SAT = require('sat')

/**
 * A static class with override methods for Phaser's tilemap collisions and tile
 * neighbour checks.
 *
 * @static
 * @class Phaser.Plugin.ArcadePolygons.Override
 */
const Overrides = {}

/**
 * Collide a sprite against all polygons.
 *
 * This is used to override Phaser.Physics.Arcade.collideSpriteVsGroup.Polygon().
 *
 * @override Phaser.Physics.Arcade#collideSpriteVsGroup
 * @method Overrides#collideSpriteVsGroup
 * @param  {Phaser.Sprite}       sprite           - The sprite to check.
 * @param  {Phaser.Group}        group            - The group to check.
 * @param  {function}            collideCallback  - An optional collision callback.
 * @param  {function}            processCallback  - An optional overlap processing callback.
 * @param  {object}              callbackContext  - The context in which to run the callbacks.
 * @param  {boolean}             overlapOnly      - Whether to only check for an overlap.
 * @return {boolean}                              - Whether a collision occurred.
 */
Overrides.collideSpriteVsGroup = function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly) {
  if (group.length === 0 || !sprite.body || !sprite.body.sat) {
    return
  }

  var body = sprite.body

  // Update the player box position
  body.sat.polygon.pos.x = body.x // SAT allows us to set polygon
  body.sat.polygon.pos.y = body.y // position properties directly

  // Lazily loop over all the polygons. In reality you'd use a quad
  // tree or some broad phase of collision detection so that you
  // don't have to test against everything, but we don't need
  // to get into optimisation here as this is just a test.
  for (var i in group.children) {
    var polygon = group.children[i]

    if (!polygon.alive) continue

    polygon.body.sat.polygon.pos.x = polygon.body.x
    polygon.body.sat.polygon.pos.y = polygon.body.y
    var response = new SAT.Response()
    var collision = SAT.testPolygonPolygon(body.sat.polygon, polygon.body.sat.polygon, response)

    // Our collision test responded positive, so let's resolve it
    if (collision) {
      if (collideCallback) {
        return collideCallback.call(callbackContext, sprite, polygon)
      }

      // Here's our overlap vector - let's invert it so it faces
      // out of the collision surface
      var overlapV = response.overlapV.clone().scale(-1)

      // Then add it to the player's position to resolve the
      // collision!
      body.position.x += overlapV.x
      body.position.y += overlapV.y

      if (overlapV.x > 0) {
        body.touching.left = true
      }
      if (overlapV.x < 0) {
        body.touching.right = true
      }

      if (overlapV.y > 0) {
        body.touching.up = true
      }
      if (overlapV.y < 0) {
        body.touching.down = true
      }

      // Let's update the SAT polygon too for any further polygons
      body.sat.polygon.pos.x = body.position.x
      body.sat.polygon.pos.y = body.position.y

      /**
       * And now, let's experiment with - goodness me - velocity!
       */
      var velocity = new SAT.Vector(body.velocity.x, body.velocity.y)

      // We need to flip our overlap normal, SAT gives it to us
      // facing inwards to the collision and we need it facing out
      var overlapN = response.overlapN.clone().scale(-1)

      // Project our velocity onto the overlap normal
      var velocityN = velocity.clone().projectN(overlapN)

      // Then work out the surface velocity
      var velocityT = velocity.clone().sub(velocityN)

      // Scale our normal velocity with a bounce coefficient
      // Ziggity, biggity, hi! https://youtu.be/Yc8bzl6dqQI
      var bounce = velocityN.clone().scale(-body.sat.bounce)

      // And scale a friction coefficient to the surface velocity
      var friction = velocityT.clone().scale(1 - body.sat.friction)

      // And finally add them together for our new velocity!
      var newVelocity = friction.clone().add(bounce)

      // Set the new velocity on our physics body
      body.velocity.x = newVelocity.x
      body.velocity.y = newVelocity.y
    }
  }
}

module.exports = Overrides
