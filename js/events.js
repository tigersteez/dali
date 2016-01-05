// EventManager singleton
// -------------------------------------------------------------------------------
(function () {
  var handlers = {};

  function registerHandler(id,handler) {
    if (!(id in handlers)) {
      handlers[id] = handler;
    }
  }

  function notifyHandler(id,eventData) {
    if (id in handlers) {
      handlers[id].handleEvent(eventData);
    }
  }

  window.dalí.events = {
    registerHandler: registerHandler,
    notifyHandler: notifyHandler
  };
} ());

// EventHandler
// -------------------------------------------------------------------------------
function EventHandler(eventTypes,myGUID) {
  // myGUID should be passed if child also extends GameObject or GameComponent
  this.eventTypes = eventTypes;
  this.myGUID = myGUID || dalí.identifier.generateObjID(this);
  this.registerForEvents();
}

EventHandler.prototype.registerForEvents = function() {
  var id = null;
  for (var i = 0; i < this.eventTypes.length; i++) {
    id = this.eventTypes[i] + "::" + this.myGUID;
    dalí.events.registerHandler(id,this);
  }
};

EventHandler.prototype.handleEvent = function(eventData) {
  if (typeof this["on" + eventData.eventType] !== 'undefined' && 
   this["on" + eventData.eventType] !== null) {
    this["on" + eventData.eventType](eventData);
  }
};

// Timeline
// -------------------------------------------------------------------------------
function Timeline() {

}
