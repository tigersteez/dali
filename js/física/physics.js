dalí.physics = {};

dalí.physics.collisionEvent = "gamecollision";

/**
 *
 */
dalí.physics.raiseCollision = function(collisionData) {
  document.dispatchEvent(
    new CustomEvent(dalí.physics.collisionEvent,{ detail: collisionData })
  );
};

/**
 * 
 */
dalí.physics.testForCollision = function(c1, c2) {
  if (dalí.physics.isPixelCollision(c1.imgData, c1.gameObj.getX(), c1.gameObj.getY(),
   c2.imgData, c2.gameObj.getX(), c2.gameObj.getY())) {
    var collisionData = {
      eventType: dalí.physics.collisionEvent,
      GUID1: c1.GUID,
      GUID2: c2.GUID,
      collInfo: {}
    };
    if (c1.isSolid && c2.isSolid) {
      dalí.physics.resolveCollision(c1,c2,collisionData);
    }
    dalí.physics.raiseCollision(collisionData);
  }
};

/**
 *
 */
dalí.physics.checkCollisions = function(room) {
  // For every mover, check for collision with remaining movers
  // and all (static) colliders.
  for (var i = 0; i < room.movers.length; i++) {
    for (var j = i + 1; j < room.movers.length; j++) {
      dalí.physics.testForCollision(room.getMover(room.movers[i]),
        room.getMover(room.movers[j]));
    }

    for (var ii = 0; ii < room.colliders.length; ii++) {
      dalí.physics.testForCollision(room.getMover(room.movers[i]),
        room.getCollider(room.colliders[ii]));
    }
  }
};

//
document.addEventListener(dalí.physics.collisionEvent, function (event) {
  var data = event.detail;

  var guidData1 = dalí.identifier.getDataFromGUID(data.GUID1);
  var guidData2 = dalí.identifier.getDataFromGUID(data.GUID2);

  dalí.events.queueEvent(dalí.physics.collisionEvent,
   data.GUID1, data);
  dalí.events.queueEvent(dalí.physics.collisionEvent, 
    guidData1.getObjID(), data);
  dalí.events.queueEvent(dalí.physics.collisionEvent, 
    data.GUID2, data);
  dalí.events.queueEvent(dalí.physics.collisionEvent, 
    guidData2.getObjID(), data);
});

/**
 *
 */
dalí.physics.resolveCollision = function(c1,c2,collisionData) {
  var collider = null, mover = null;
  if (!(c1 instanceof Mover) || !(c2 instanceof Mover)) {
    if (!(c1 instanceof Mover)) {
      collider = c1;
      mover = c2;
    } else {
      collider = c2;
      mover = c1;
    }
  } else { // both are Movers
    if ((c1.imgData.width * c1.imgData.height) < 
      (c2.imgData.width * c2.imgData.height)) {
      collider = c2;
      mover = c1;
    } else {
      collider = c1;
      mover = c2;
    }
  }

  // resolve collision
  var pos1 = mover.gameObj.transform.position;
  var pos2 = collider.gameObj.transform.position;  

  var slopeX = collider.imgData.height / collider.imgData.width;
  var slopeY = 1 / slopeX;

  var top = false, bottom = false, right = false, left = false;

  if (mover.velocity.x <= 0) {
    // left
    var h1 = (pos2.x + collider.imgData.width - pos1.x) * slopeX;
    var h2 = pos2.y + h1;
    h1 = pos2.y + collider.imgData.height - h1;
    left = (pos1.x + mover.imgData.width > pos2.x + collider.imgData.width 
      && (pos1.y >= h2 || pos1.y + mover.imgData.height <= h1));
  } 

  if (mover.velocity.x >= 0) {
    // right
    var h1 = ((pos1.x + mover.imgData.width) - pos2.x) * slopeX;
    var h2 = pos2.y + h1;
    h1 = pos2.y + collider.imgData.height - h1;
    right = ( pos1.x < pos2.x && (pos1.y >= h2 || pos1.y + mover.imgData.height <= h1));
  }

  if (left) {
    pos1.x = pos2.x + collider.imgData.width;
  } else if (right) { 
    pos1.x = pos2.x - mover.imgData.width;
  }

  if (mover.velocity.y <= 0) {
    // top
    var w1 = (pos2.y + collider.imgData.height - pos1.y) * slopeY;
    var w2 = pos2.x + collider.imgData.width - w1;
    w1 = pos2.x + w1;
    top = (pos1.y + mover.imgData.height > pos2.y + collider.imgData.height &&
     (pos1.x >= w1 || pos1.x + mover.imgData.width <= w2));
  }

  if (mover.velocity.y >= 0) {
    // bottom
    var w1 = (pos1.y + mover.imgData.height - pos2.y) * slopeY;
    var w2 = pos2.x + collider.imgData.width - w1;
    w1 = pos2.x + w1;
    bottom = (pos1.y < pos2.y && (pos1.x >= w1 || pos1.x + mover.imgData.width <= w2));
  }

  if (top) {
    pos1.y = pos2.y + collider.imgData.height;
  } else if (bottom) {
    pos1.y = pos2.y - mover.imgData.height;
  }

  collisionData.collInfo[mover.GUID] = {
    top: top,
    bottom: bottom,
    left: left,
    right: right
  };
  
  collisionData.collInfo[collider.GUID] = {
    top: bottom,
    bottom: top,
    left: right,
    right: left
  };

};

/**
 * src: http://www.playmycode.com/blog/2011/08/javascript-per-pixel-html5-canvas-image-collision-detection/
 * @author Joseph Lenton - PlayMyCode.com
 *
 * @param first An ImageData object from the first image we are colliding with.
 * @param x The x location of 'first'.
 * @param y The y location of 'first'.
 * @param other An ImageData object from the second image involved in the collision check.
 * @param x2 The x location of 'other'.
 * @param y2 The y location of 'other'.
 */
dalí.physics.isPixelCollision = function(first, x, y, other, x2, y2) {
    if (first !== null && other !== null) {
      // we need to avoid using floats, as were doing array lookups
      x  = Math.round( x );
      y  = Math.round( y );
      x2 = Math.round( x2 );
      y2 = Math.round( y2 );

      var w  = first.width,
          h  = first.height,
          w2 = other.width,
          h2 = other.height ;

      // find the top left and bottom right corners of overlapping area
      var xMin = Math.max( x, x2 ),
          yMin = Math.max( y, y2 ),
          xMax = Math.min( x+w, x2+w2 ),
          yMax = Math.min( y+h, y2+h2 );

      // Sanity collision check, we ensure that the top-left corner is both
      // above and to the left of the bottom-right corner.
      if ( xMin >= xMax || yMin >= yMax ) {
          return false;
      }

      var xDiff = xMax - xMin,
          yDiff = yMax - yMin;

      // get the pixels out from the images
      var pixels  = first.data,
          pixels2 = other.data;

      // if the area is really small,
      // then just perform a normal image collision check
      if ( xDiff < 4 && yDiff < 4 ) {
          for ( var pixelX = xMin; pixelX < xMax; pixelX++ ) {
              for ( var pixelY = yMin; pixelY < yMax; pixelY++ ) {
                  if (
                          ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
                          ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
                  ) {
                      return true;
                  }
              }
          }
      } else {
          /* What is this doing?
           * It is iterating over the overlapping area,
           * across the x then y the,
           * checking if the pixels are on top of this.
           *
           * What is special is that it increments by incX or incY,
           * allowing it to quickly jump across the image in large increments
           * rather then slowly going pixel by pixel.
           *
           * This makes it more likely to find a colliding pixel early.
           */

          // Work out the increments,
          // it's a third, but ensure we don't get a tiny
          // slither of an area for the last iteration (using fast ceil).
          var incX = xDiff / 3.0,
              incY = yDiff / 3.0;
          incX = (~~incX === incX) ? incX : (incX+1 | 0);
          incY = (~~incY === incY) ? incY : (incY+1 | 0);

          for ( var offsetY = 0; offsetY < incY; offsetY++ ) {
              for ( var offsetX = 0; offsetX < incX; offsetX++ ) {
                  for ( var pixelY = yMin+offsetY; pixelY < yMax; pixelY += incY ) {
                      for ( var pixelX = xMin+offsetX; pixelX < xMax; pixelX += incX ) {
                          if (
                                  ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
                                  ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
                          ) {
                              return true;
                          }
                      }
                  }
              }
          }
      }
    }
    return false;
};
