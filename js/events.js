// EventManager singleton
// -------------------------------------------------------------------------------
(function () {
  var handlers = {};

  var eventQueue = new Queue();

  function registerHandler(id,handler) {
    if (!(id in handlers)) {
      handlers[id] = handler;
    }
  }

  function notifyHandler(handle,eventData) {
    if (handle in handlers) {
      handlers[handle].handleEvent(eventData);
    }
  }

  function queueEvent(type,id,eventData) {
    eventQueue.enqueue({
      handle: type + "::" + id,
      data: eventData
    });
  }

  function emptyQueue() {
    eventQueue.emptyQueue(function(event){
      notifyHandler(event.handle, event.data);
    });
  }

  window.dalí.events = {
    registerHandler: registerHandler,
    notifyHandler: notifyHandler,
    queueEvent: queueEvent,
    emptyQueue: emptyQueue
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
