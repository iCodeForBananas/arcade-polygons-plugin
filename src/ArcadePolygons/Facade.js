/**
 * A facade class to attach to a Phaser game.
 *
 * @class Phaser.Plugin.ArcadePolygons.Facade
 * @constructor
 * @param {Phaser.Plugin.ArcadePolygons.TileSlopeFactory} factory       - A tile slope factory.
 * @param {object}                                      solvers       - A set of collision solvers.
 * @param {integer}                                     defaultSolver - The default collision solver type to use for sloped tiles.
 */
Phaser.Plugin.ArcadePolygons.Facade = function () {}

/**
 * Enable the physics body of the given object for SAT polygon interaction.
 *
 * @method Phaser.Plugin.ArcadePolygons.Facade#enable
 * @param {Phaser.Sprite|Phaser.Group} object - The object to enable sloped tile physics for.
 * @param {SAT} object - The object that describes the type of polygon to create.
 */
Phaser.Plugin.ArcadePolygons.Facade.prototype.enable = function (object, satPolygon) {
  if (Array.isArray(object)) {
    for (var i = 0; i < object.length; i++) {
      this.enable(object[i])
    }
  } else {
    if (object instanceof Phaser.Group) {
      this.enable(object.children)
    } else {
      if (object.hasOwnProperty('body')) {
        this.enableBody(object.body, satPolygon)
      }

      if (object.hasOwnProperty('children') && object.children.length > 0) {
        this.enable(object.children)
      }
    }
  }
}

/**
 * Enable the given physics body for sloped tile interaction.
 *
 * @method Phaser.Plugin.ArcadePolygons.Facade#enableBody
 * @param {Phaser.Physics.Arcade.Body} body - The physics body to enable.
 */
Phaser.Plugin.ArcadePolygons.Facade.prototype.enableBody = function (body, satPolygon) {
  body.sat = {
    polygon: satPolygon
  }
}
