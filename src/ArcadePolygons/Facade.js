/**
 * A facade class to attach to a Phaser game.
 *
 * @class Phaser.Plugin.ArcadeSlopes.Facade
 * @constructor
 * @param {Phaser.Plugin.ArcadeSlopes.TileSlopeFactory} factory       - A tile slope factory.
 * @param {object}                                      solvers       - A set of collision solvers.
 * @param {integer}                                     defaultSolver - The default collision solver type to use for sloped tiles.
 */
Phaser.Plugin.ArcadePolygons.Facade = function () {}

/**
 * Enable the physics body of the given object for sloped tile interaction.
 *
 * @method Phaser.Plugin.ArcadeSlopes.Facade#enable
 * @param {Phaser.Sprite|Phaser.Group} object - The object to enable sloped tile physics for.
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
 * TODO: Circle body support, when it's released.
 *
 * @method Phaser.Plugin.ArcadeSlopes.Facade#enableBody
 * @param {Phaser.Physics.Arcade.Body} body - The physics body to enable.
 */
Phaser.Plugin.ArcadePolygons.Facade.prototype.enableBody = function (body, satPolygon) {
  // Conveniently add it to the player body and convert it to a
  // polygon while we're at it
  body.sat = {
    polygon: satPolygon
  }
}
