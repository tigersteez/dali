// Multiple inheritence test....
// ------------------------------------------------------

function TestObj() {
  GameObject.call(this,0,0);
  EventHandler.call(this,["gamecollision","onkeydown"]); 
}

EventHandler.prototype.printEventTypes = function() {
  for (var i = 0; i < this.eventTypes.length; i++) {
    console.log(this.eventTypes[i]);
  }
};

GameObject.prototype.printGUID = function() {
  console.log(this.GUID);
}

EventHandler.prototype.printMyGUID = function() {
  console.log(this.myGUID);
}

dalí.extend(GameObject, TestObj);
dalí.extend(EventHandler, TestObj);

var testObj = new TestObj();
console.log(testObj.getX());
testObj.printEventTypes();
testObj.printGUID();
testObj.printMyGUID();

if (testObj instanceof GameObject) {
  console.log("GameObject");
}

if (testObj instanceof EventHandler) {
  console.log("EventHandler");
}
