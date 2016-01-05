// EventManager singleton
// -------------------------------------------------------------------------------
(function () {
  var handlers = {};

  window.dalí.events = {

  };
} ());

// EventHandler
// -------------------------------------------------------------------------------
function EventHandler(eventTypes,myGUID) {
  this.eventTypes = eventTypes;
  // myGUID should be passed if child also extends GameObject or GameComponent
  this.myGUID = myGUID || this.constructor.name + "::" +
    dalí.identifier.getClientID() + "::" +
    dalí.identifier.randomString(7);
}

EventHandler.prototype.registerForEvents = function() {
  
};

EventHandler.prototype.handleEvent = function() {

};

// Timeline
// -------------------------------------------------------------------------------
function Timeline() {

}
