const decomp = require('poly-decomp')
const SAT = require('sat')

/**
 * A facade class to attach to a Phaser game.
 *
 * @class Phaser.Plugin.ArcadePolygons.Facade
 * @constructor
 * @param {Phaser.Plugin.ArcadePolygons.TileSlopeFactory} factory     - A tile slope factory.
 * @param {object}                                      solvers       - A set of collision solvers.
 * @param {integer}                                     defaultSolver - The default collision solver type to use for sloped tiles.
 */
const Facade = function () {}

/**
 * Enable the physics body of the given object for SAT polygon interaction.
 *
 * @method Phaser.Plugin.ArcadePolygons.Facade#enable
 * @param {Phaser.Sprite|Phaser.Group} object - The group to enable polygon physics for.
 * @param {SAT} object - The object that describes the type of polygon to create.
 */
Facade.prototype.enable = function (object, vertices) {
  if (Array.isArray(object)) {
    for (var i = 0; i < object.length; i++) {
      this.enable(object[i])
    }
  } else {
    if (object instanceof Phaser.Group) {
      this.enable(object.children)
    } else {
      if (object.hasOwnProperty('body')) {
        this.enableBody(object.body, vertices)
      }

      if (object.hasOwnProperty('children') && object.children.length > 0) {
        this.enable(object.children)
      }
    }
  }
}

/**
 * Enable the given physics body for polygon interaction.
 *
 * @method Phaser.Plugin.ArcadePolygons.Facade#enableBody
 * @param {Phaser.Physics.Arcade.Body} body - The physics body to enable.
 */
Facade.prototype.enableBody = function (body, vertices) {
  var polygonVectors = []
  for (var i = 0; i < vertices.length; i += 2) {
    polygonVectors.push(new SAT.Vector(vertices[i], vertices[i + 1]))
  }

  var satPolygon = new SAT.Polygon(
    new SAT.Vector(0, 0),
    polygonVectors
  )

  body.sat = {
    polygon: satPolygon
  }
}

/**
 * Enable the given sprite body with a box polygon.
 *
 * @method Phaser.Plugin.ArcadePolygons.Facade#enableSpriteBody
 * @param {Phaser.Physics.Arcade.Body} body - The physics body to enable.
 */
Facade.prototype.enableSpriteBody = function (sprite, scope) {
  if (!sprite.hasOwnProperty('body')) {
    console.error('Enable arcade physics before enabling polygon physics.')
  }

  scope.game.physics.arcade.enable(sprite)

  var body = sprite.body
  var satPolygon = new SAT.Box(
    new SAT.Vector(body.x, body.y),
    body.width,
    body.height
  ).toPolygon()

  body.sat = {
    polygon: satPolygon
  }
}

/**
 * Create polygons from an array of points and add them to the defined group.
 *
 * @method Phaser.Plugin.ArcadePolygons.Facade#enableGroup
 * @param {Phaser.Physics.Arcade.Group} group - The group to create polygons for.
 * @param {array} polygonPoints - The physics body to enable.
 * @param {object} scope - The game reference to add sprites too.
 */
Facade.prototype.enableGroup = function (group, polygonPoints, scope) {
  var processedPolygonPoints = []
  polygonPoints.forEach(function (polygon) {
    var decomposedPolygonGroup = decomp.quickDecomp(polygon)
    decomposedPolygonGroup.forEach(function (decomposedPolygon) {
      // Flatten an array of arrays of points
      // [[1,2],[3,4],[5,6]] -> [1,2,3,4,5,6]
      processedPolygonPoints.push(flatten(decomposedPolygon))
    })
  })

  processedPolygonPoints.forEach(function (vertices) {
    var sprite = scope.game.add.sprite(0, 0)
    scope.game.physics.arcade.enable(sprite)
    scope.game.arcadePolygons.enable(sprite, vertices)
    sprite.body.immovable = true
    sprite.body.allowGravity = false
    group.add(sprite)
  })
}

function flatten (array) {
  return [].concat.apply([], array)
}

module.exports = Facade
