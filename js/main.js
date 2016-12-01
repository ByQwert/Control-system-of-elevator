// Init
var mainFrame = new MainFrame();
var humanity = [],
names = ["Bob","Tom", "Mike", "Sam", "Jack", "Steve", "Anton"];

// GUI
$( "#generate-form" ).dialog({
	resizable: false,
	height: "auto",
	width: 400,
	modal: true,
	buttons: {
		"Generate": function() {
			if ($('input[name="floors"]').val() > 0 && $('input[name="humans"]').val() > 0) {
				$( this ).dialog( "close" );
				mainFrame.generate($('input[name="floors"]').val(),$('input[name="humans"]').val());
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
	$( "#add-human-form" ).dialog("open");
}

dialog = $( "#add-human-form" ).dialog({
  autoOpen: false,
  height: 400,
  width: 350,
  modal: true,
  buttons: {
   	"Add account": mainFrame.addHuman, 
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
		//console.log(floors,humans);
		house = new House(floors,humans);
		for (var i = 0; i < house.amountOfHumans; i++) {
			name = names[getRandomInt(0,names.length-1)];
			weight = getRandomInt(50,100);
			spawnFloor = getRandomInt(1,house.amountOfFloors);				
			do {
				targetFloor = getRandomInt(1,house.amountOfFloors);
			} while(spawnFloor == targetFloor);
			humanity.push(new Human(name,weight,spawnFloor,targetFloor));
		}
		elevator = new Elevator();
		//$("#stats").text("");
		$("#amount-of-floors").text(house.amountOfFloors);
		$("#amount-of-humans").text(house.amountOfHumans);
		$("#stats-table").show();			
		for (var i = 0; i < house.amountOfHumans; i++) {
			$("#humanity").append('<h6>' + humanity[i].name + '</h6><p>' + humanity[i].state + humanity[i].spawnFloor + '</p>');
		}		
		$("#humanity").show();	
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
		dialog.dialog("close");
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
	this.pressMoveButton = function() {
	};
	this.wait = function() {
	}
	this.state = "Waiting for elevator on floor ";
}

