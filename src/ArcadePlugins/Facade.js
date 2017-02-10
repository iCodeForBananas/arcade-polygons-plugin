

/**
 * A facade class to attach to a Phaser game.
 *
 * TODO: Extract a CollisionHandler/CollisionResolver class that stores solvers
 *       and defaultSolver that the facade can just forward calls to.
 * 
 * @class Phaser.Plugin.ArcadeSlopes.Facade
 * @constructor
 * @param {Phaser.Plugin.ArcadeSlopes.TileSlopeFactory} factory       - A tile slope factory.
 * @param {object}                                      solvers       - A set of collision solvers.
 * @param {integer}                                     defaultSolver - The default collision solver type to use for sloped tiles.
 */
Phaser.Plugin.ArcadePolygons.Facade = function (factory, solvers, defaultSolver) {
	/**
	 * A tile slope factory.
	 * 
	 * @property {Phaser.Plugin.ArcadeSlopes.TileSlopeFactory} factory
	 */
	this.factory = factory;
	
	/**
	 * A set of collision solvers.
	 * 
	 * Maps solver constants to their respective instances.
	 * 
	 * @property {object} solvers
	 */
	this.solvers = solvers;
	
	/**
	 * The default collision solver type to use for sloped tiles.
	 * 
	 * @property {string} defaultSolver
	 * @default
	 */
	this.defaultSolver = defaultSolver || Phaser.Plugin.ArcadePolygons.SAT;
}

/**
 * Enable the physics body of the given object for sloped tile interaction.
 *
 * @method Phaser.Plugin.ArcadeSlopes.Facade#enable
 * @param {Phaser.Sprite|Phaser.Group} object - The object to enable sloped tile physics for.
 */
Phaser.Plugin.ArcadePolygons.Facade.prototype.enable = function (object) {
	if (Array.isArray(object)) {
		for (var i = 0; i < object.length; i++) {
			this.enable(object[i]);
		}
	} else {
		if (object instanceof Phaser.Group) {
			this.enable(object.children);
		} else {
			if (object.hasOwnProperty('body')) {
				this.enableBody(object.body);
			}
			
			if (object.hasOwnProperty('children') && object.children.length > 0) {
				this.enable(object.children);
			}
		}
	}
};

/**
 * Enable the given physics body for sloped tile interaction.
 * 
 * TODO: Circle body support, when it's released.
 *
 * @method Phaser.Plugin.ArcadeSlopes.Facade#enableBody
 * @param {Phaser.Physics.Arcade.Body} body - The physics body to enable.
 */
Phaser.Plugin.ArcadePolygons.Facade.prototype.enableBody = function (body) {

  // Conveniently add it to the player body and convert it to a
  // polygon while we're at it
  // body.sat = {
  //   polygon: new window.SAT.Box(
  //     new window.SAT.Vector(body.x, body.y),
  //     body.width,
  //     body.height
  //   ).toPolygon()
  // }

};
