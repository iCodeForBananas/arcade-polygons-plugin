/**
 * @author Chris Andrew <chris@hexus.io>
 * @author RangerSteve.io
 * @copyright 2017 RangerSteve.io and Chris Andrew
 * @license MIT
 */

/**
 * Arcade Slopes provides sloped tile functionality for tilemaps that use
 * Phaser's Arcade physics engine.
 *
 * @class Phaser.Plugin.ArcadeSlopes
 * @constructor
 * @extends Phaser.Plugin
 * @param {Phaser.Game} game          - A reference to the game using this plugin.
 * @param {any}         parent        - The object that owns this plugin, usually a Phaser.PluginManager.
 * @param {integer}     defaultSolver - The default collision solver type to use for sloped tiles.
 */
Phaser.Plugin.ArcadePolygons = function (game, parent) {
  Phaser.Plugin.call(this, game, parent)

  /**
   * The Arcade Slopes facade.
   *
   * @property {Phaser.Plugin.ArcadeSlopes.Facade} facade
   */
  this.facade = new Phaser.Plugin.ArcadePolygons.Facade()
}

Phaser.Plugin.ArcadePolygons.prototype = Object.create(Phaser.Plugin.prototype)
Phaser.Plugin.ArcadePolygons.prototype.constructor = Phaser.Plugin.ArcadePolygons

/**
 * The Arcade Slopes plugin version number.
 *
 * @constant
 * @type {string}
 */
Phaser.Plugin.ArcadePolygons.VERSION = '1'

/**
 * The Separating Axis Theorem collision solver type.
 *
 * Uses the excellent SAT.js library.
 *
 * @constant
 * @type {string}
 */
Phaser.Plugin.ArcadePolygons.SAT = 'sat'

/**
 * Initializes the plugin.
 *
 * @method Phaser.Plugin.ArcadeSlopes#init
 */
Phaser.Plugin.ArcadePolygons.prototype.init = function () {
  // Give the game an Arcade Slopes facade
  this.game.arcadePolygons = this.game.arcadePolygons || this.facade

  // Keep a reference to the original Arcade.collideSpriteVsTilemapLayer method
  this.originalCollideSpriteVsGroup = Phaser.Physics.Arcade.prototype.collideSpriteVsGroup

  // Replace the original method with the Arcade Slopes override, along with
  // some extra methods that break down the functionality a little more
  Phaser.Physics.Arcade.prototype.collideSpriteVsGroup = Phaser.Plugin.ArcadePolygons.Overrides.collideSpriteVsGroup
}

/**
 * Destroys the plugin and nulls its references. Restores any overriden methods.
 *
 * @method Phaser.Plugin.ArcadeSlopes#destroy
 */
Phaser.Plugin.ArcadePolygons.prototype.destroy = function () {
  // Null the game's reference to the facade
  this.game.arcadePolygons = null

  // Restore the original collideSpriteVsTilemapLayer method and null the rest
  Phaser.Physics.Arcade.prototype.collideSpriteVsGroup = this.originalCollideSpriteVsGroup

  // Call the parent destroy method
  Phaser.Plugin.prototype.destroy.call(this)
}
