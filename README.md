# Arcade Polygons Plugin

### 1. Add plugin to your game and enable arcade physics in the `create` method

```javascript
// other code
create: function () {
  this.game.plugins.add(Phaser.Plugin.ArcadePolygons)
  this.physics.startSystem(Phaser.Physics.Arcade)

  // Create sprites and polygons below
},
// other code
```

### 2. Enable arcade physics on your sprite and then enable polygon physics on it in the `create` method

```javascript
// other code
create: function () {
  // previous code

  // Add a new sprite to the game world, using the graphics above
  this.player = this.game.add.sprite(60, 72, 'player-sprite-image')

  // Give it an Arcade physics body that we can use
  this.game.physics.arcade.enable(this.player)

  // Enable arcade polygon collisions with sprite body
  this.game.arcadePolygons.enableSpriteBody(this.player)
},
// other code
```

### 3. Create a group polygons to contain your polygons and add your polygons as sprites in the `create` method

```javascript
// other code
create: function () {
  // previous code

  // Define a bunch of polygon vertice coordinates to render and collide against
  let polygonPoints = [
    [
      0, 750,
      1280, 700,
      1280, 800,
      0, 800,
    ],
    // other polygon vertices
  ]

  // The group your previous sprite will collide against
  this.polygons = this.game.add.group()

  // Create a polygon from each polygon point defined above
  this.game.physics.arcade.enable(sprite)
  this.game.arcadePolygons.enableGroup(this.polygons, polygonPoints)
},
// other code
```

### 4. Check for collisions in the `update` method

```javascript
// other code
update: function () {
  this.game.physics.arcade.collide(this.player, this.polygons)
},
// other code
```
