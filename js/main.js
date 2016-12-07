// Init
var settings = {
	minWeight: 50,
	maxWeight: 100
};
var mainFrame = new MainFrame();
var humanity = [],
names = ["Bob","Tom", "Mike", "Sam", "Jack", "Steve", "Anton"];
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

// Additional
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
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
			humanity.push(new Human(name,weight,spawnFloor,targetFloor));
		}		
		// GUI
		$("#amount-of-floors").text(house.amountOfFloors);
		$("#amount-of-humans").text(house.amountOfHumans);		
		for (var i = 0; i < house.amountOfHumans; i++) {
			$("#humanity").append('<h6>' + humanity[i].name + '</h6><p>' + humanity[i].state + humanity[i].spawnFloor + '</p>');
		}		
		$("#main-table").show();	
		$( "#humanity" ).accordion({
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
		spawnFloor = +$("[name=spawnFloor]").val();
		if (spawnFloor < 1 || spawnFloor > house.amountOfFloors) {
			validator = false;
		} 
		targetFloor = +$("[name=targetFloor]").val(); 
		if (targetFloor < 1 || targetFloor > house.amountOfFloors || targetFloor == spawnFloor) {
			validator = false;
		} 
		if (validator) {
			humanity.push(new Human(name,weight,spawnFloor,targetFloor));
			$("#humanity").append('<h6>' + humanity[humanity.length-1].name + '</h6><p>' + humanity[humanity.length-1].state + humanity[humanity.length-1].spawnFloor + '</p>');
			$( "#humanity" ).accordion( "refresh" );
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
}

function Elevator() {
	this.currentWeight;
	this.targetFloor;
	this.indicatorState;
	this.currentFloor = 1;
	this.doorState = false;
	this.state = "Staying with closed doors";
	this.passengers = [];
	this.chooseNextFloor = function() {
	};
	this.wait = function() {
	};
	this.move = function() {
	};
}

function Human(name, weight, spawnFloor, targetFloor) {
	this.name = name;
	this.weight = weight;
	this.spawnFloor = spawnFloor;
	this.targetFloor = targetFloor;		
	this.pressSpawnFloorButton = function() {
		if (!buttonsOfHouse[spawnFloor-1].state) {
			buttonsOfHouse[spawnFloor-1].state = true;
		}		
	}
	this.pressTargetFloorButton = function() {
		if (!buttonsOfElevator[targetFloor-1].state) {
			buttonsOfElevator[targetFloor-1].state = true;
		}
	}
	this.pressMoveButton = function() {
	};
	this.wait = function() {
	}
	this.state = "Waiting for elevator on floor ";
}

function Button(floor) {
	this.state = false;
	this.floor = floor;
}

