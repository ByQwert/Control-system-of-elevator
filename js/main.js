// Additional
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Init
var settings = {
	minWeight: 25,
	maxWeight: 100,
	speed: 1000,
};
var mainFrame = new MainFrame(),
		statistic = new Statistic();
var names = ["Bob","Tom", "Mike", "Sam", "Jack", "Steve", "Anton"];
var buttonsOfHouse = [],
		buttonsOfElevator = [];

// GUI
$( "#generate-form" ).dialog({
	resizable: false,
	height: "auto",
	width: 400,
	modal: true,
	buttons: {
		"Generate": function() {
			if ($('input[name="floors"]').val() > 0 && $('input[name="humans"]').val() > 0) {
				mainFrame.generate(+$('input[name="floors"]').val(),+$('input[name="humans"]').val());
				$( this ).dialog( "close" );				
			} else {	
				alert("Invalid data!");
			}        
		},
		"Cancel": function() {
			$( this ).dialog( "close" );
		}
	}
});

function openAddHumanForm() {
	$( "#add-human-div" ).dialog("open");
}

dialog = $( "#add-human-div" ).dialog({
  autoOpen: false,
  height: 400,
  width: 350,
  modal: true,
  buttons: {
   	"Add human": mainFrame.addHuman, 
    Cancel: function() {
      $( this ).dialog( "close" );
    }
   },
});

function launchSystem() {
	elevator.chooseNextFloor();
}

// Classes
function MainFrame() {
	this.generate = function(floors,humans) {
		// Create house, elevator and massives of buttons
		house = new House(floors,humans);
		elevator = new Elevator();
		for (var i = 0; i < house.amountOfFloors; i++) {
			buttonsOfHouse.push(new Button(i+1));
			buttonsOfElevator.push(new Button(i+1));
		}
		// Create humans
		for (var i = 0; i < house.amountOfHumans; i++) {
			name = names[getRandomInt(0,names.length-1)];
			weight = getRandomInt(settings.minWeight,settings.maxWeight);
			spawnFloor = getRandomInt(1,house.amountOfFloors);				
			do {
				targetFloor = getRandomInt(1,house.amountOfFloors);
			} while(spawnFloor == targetFloor);
			house.pending.push(new Human(name,weight,spawnFloor,targetFloor));
		}		
		// Update statistic
		statistic.amountOfCreatedHumans = house.amountOfHumans;
		// GUI
		$("#amount-of-floors").text(house.amountOfFloors);
		$("#amount-of-humans").text(house.amountOfHumans);		
		for (var i = 0; i < house.amountOfHumans; i++) {
			$("#pending").append('<h6>' + house.pending[i].name + '</h6><p>' + house.pending[i].state + house.pending[i].spawnFloor + '</p>');
		}		
		$("#main-table").show();	
		$( "#pending" ).accordion({
 			collapsible: true,
 			active: false
 		});
	};
	this.launchSystem = function() {
		
	};
	this.stopSystem = function() {

	};
	this.addHuman = function() {
		var validator = true;
		name = $("[name=name]").val();
		weight = +$("[name=weight]").val();
		if (weight < 25 || isNaN(weight)) {
			validator = false;
		}
		spawnFloor = +$("[name=spawnFloor]").val();
		if (spawnFloor < 1 || spawnFloor > house.amountOfFloors || isNaN(spawnFloor)) {
			validator = false;
		} 
		targetFloor = +$("[name=targetFloor]").val(); 
		if (targetFloor < 1 || targetFloor > house.amountOfFloors || targetFloor == spawnFloor || isNaN(targetFloor)) {
			validator = false;
		} 
		if (validator) {
			// Create new human
			house.pending.push(new Human(name,weight,spawnFloor,targetFloor));
			house.amountOfHumans++;
			// Update statistic
			statistic.amountOfCreatedHumans++;
			// GUI
			$("#amount-of-humans").text(house.amountOfHumans);			
			$("#pending").append('<h6>' + house.pending[house.pending.length-1].name + '</h6><p>' + house.pending[house.pending.length-1].state + house.pending[house.pending.length-1].spawnFloor + '</p>');
			$( "#pending" ).accordion( "refresh" );
			dialog.dialog("close");
			$("#add-human-form")[0].reset();
		} else {
			alert("Invalid data!");
			validator = true;
		}		
	}
}

function House(floors,humans) {
	this.amountOfFloors = floors;
	this.amountOfHumans = humans;
	this.pending = [];
}

function Elevator() {
	this.currentWeight;
	this.targetFloor;
	this.indicatorState;
	this.currentFloor = 1;
	this.doorState = false;
	this.state = "Staying with closed doors";
	this.passengers = [];
	this.priorityDistance = house.amountOfFloors-1;
	this.chooseNextFloor = function() {
		if (this.passengers.length == 0) {
			for (var i = 0; i < buttonsOfHouse.length; i++) {
				if (buttonsOfHouse[i].state) {
					if (this.currentFloor-1 == i) {
						this.targetFloor = i+1;
						break;
					} else {
						if (Math.abs(this.currentFloor-i) < this.priorityDistance) {
							this.priorityDistance = Math.abs(this.currentFloor - i);
							this.targetFloor = i+1;
						}
					}					
				}
			}
			this.move();
		}		
	};
	this.wait = function() {
	};
	this.move = async function() {
		if (this.currentFloor < this.targetFloor) {
			this.state = "Moving up";		
			$("#animation").html(this.state + "<br>" + this.currentFloor);
			//console.log("moving");
			await sleep(settings.speed);
			for (var i = this.currentFloor+1; i != this.targetFloor+1; i++) {	
				this.currentFloor = i;
				if (i != this.targetFloor) {
					$("#animation").html(this.state + "<br>" + this.currentFloor);
					//console.log(this.currentFloor);
					//console.log("moving");
					await sleep(settings.speed);
				} else {
					this.doorState = true;
					this.state = "Staying with opened doors";	
					$("#animation").html(this.state + "<br>" + this.currentFloor);
					//console.log("target");
				}
			}
		} 
		if (this.currentFloor > this.targetFloor) {

		}
		if (this.currentFloor == this.targetFloor) {
			this.doorState = true;
			this.state = "Staying with opened doors";	
			$("#animation").html(this.state + "<br>" + this.currentFloor);
		}
		//this.passengers.push()
	};
}

function Human(name, weight, spawnFloor, targetFloor) {
	this.name = name;
	this.weight = weight;
	this.spawnFloor = spawnFloor;
	this.targetFloor = targetFloor;		
	this.pressSpawnFloorButton = function() {
		if (!buttonsOfHouse[this.spawnFloor-1].state) {
			buttonsOfHouse[this.spawnFloor-1].state = true;
		}		
	}
	this.pressTargetFloorButton = function() {
		if (!buttonsOfElevator[this.targetFloor-1].state) {
			buttonsOfElevator[this.targetFloor-1].state = true;
		}
	}
	this.pressMoveButton = function() {
	};
	this.wait = function() {
	}
	this.pressSpawnFloorButton();
	this.state = "Waiting for elevator on floor ";	
}

function Button(floor) {
	this.state = false;
	this.floor = floor;
}

function Statistic() {
	this.amountOfRides = 0;
	this.amountOfEmptyRides = 0;
	this.sumWeight = 0;
	this.amountOfCreatedHumans = 0;
}