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
	speed: 2500,
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
			if ($('input[name="floors"]').val() > 1 && $('input[name="humans"]').val() > -1) {
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

// Classes
function MainFrame() {
	state = "Stopped";
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
			$("#pending").append('<h6>' + house.pending[i].name + '</h6><p id=' + house.pending[i].ID + '>' + house.pending[i].state + '</p>');
		}		
		$("#main-table").show();	
		$( "#pending" ).accordion({
 			collapsible: true,
 			active: false
 		});
 		$( "#passengers" ).accordion({
 			collapsible: true,
 			active: false
 		});
 		$( "#delivered" ).accordion({
 			collapsible: true,
 			active: false
 		});
	};
	this.launchSystem = function() {
		this.state = "Working";
		statistic.amountOfCreatedHumans = house.amountOfHumans;
		// GUI		
		$("[onclick=mainFrame\\.launchSystem\\(\\)]").prop('disabled', true);
		$("[onclick=mainFrame\\.stopSystem\\(\\)]").prop('disabled', false);
		$("#amount-of-moving").text("1");
		$("#amount-of-stopped").text("0");
		elevator.chooseNextFloor();
	};
	this.stopSystem = function() {
		if (!buttonsOfElevator.some(function(button) {return button.state == true }) && elevator.doorsState == false) {
			this.state = "Stopped";
			// GUI
			$("[onclick=mainFrame\\.stopSystem\\(\\)]").prop('disabled', true);
			$("[onclick=mainFrame\\.launchSystem\\(\\)]").prop('disabled', false);
			$("#amount-of-moving").text("0");
			$("#amount-of-stopped").text("1");
			// Statistic
			alert("Total amount of rides: " + statistic.amountOfRides + "\nAmount of empty rides: " + statistic.amountOfEmptyRides + "\nTotal moved weight: " + statistic.sumWeight + "\nTotal amount of humans: " + statistic.amountOfCreatedHumans);
			statistic.amountOfRides = 0;
			statistic.amountOfEmptyRides = 0;
			statistic.sumWeight = 0;
			statistic.amountOfCreatedHumans = 0;
		} else {
			alert("Can't stop system now!");
		}
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
			$("#amount-of-humans").text(house.pending.length+elevator.passengers.length);			
			$("#pending").append('<h6>' + house.pending[house.pending.length-1].name + '</h6><p id='+ house.pending[house.pending.length-1].ID +'>' + house.pending[house.pending.length-1].state  + '</p>');
			$( "#pending" ).accordion( "refresh" );
			dialog.dialog("close");
			$("#add-human-form")[0].reset();
			if (!buttonsOfElevator.some(function(button) {return button.state == true }) && elevator.state == "Staying with closed doors" && mainFrame.state == "Waiting") {
				elevator.chooseNextFloor();
			}
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
	this.delivered = [];
}

function Elevator() {
	this.currentWeight = 0;
	this.targetFloor;
	this.indicatorState = false;
	this.currentFloor = 1;
	this.doorsState = false;
	this.state = "Staying with closed doors";
	this.passengers = [];
	this.priorityDistance = house.amountOfFloors-1;
	this.chooseNextFloor = function() {
		if (buttonsOfElevator.some(function(button) {return button.state == true })) {
			for (var i = 0; i < buttonsOfElevator.length; i++) {
				if (buttonsOfElevator[i].state) {
					if (Math.abs(this.currentFloor-i-1) <= this.priorityDistance) {
						this.priorityDistance = Math.abs(this.currentFloor-i-1);
						this.targetFloor = i+1;
					}
				}
			}
			console.log(this.targetFloor);	
			this.priorityDistance = house.amountOfFloors-1;	
			this.move();
		} else {
			if (buttonsOfHouse.some(function(button) {return button.state == true })) {
				statistic.amountOfEmptyRides++;
				for (var i = 0; i < buttonsOfHouse.length; i++) {
					if (buttonsOfHouse[i].state) {
						if (this.currentFloor-1 == i) {
							this.targetFloor = i+1;
							break;
						} else {
							if (Math.abs(this.currentFloor-i-1) <= this.priorityDistance) {
								this.priorityDistance = Math.abs(this.currentFloor-i-1);
								this.targetFloor = i+1;
							}
						}					
					}
				}
				console.log(this.targetFloor);	
				this.priorityDistance = house.amountOfFloors-1;	
				this.move();
			} else {
				mainFrame.state = "Waiting";
			}
		}	
	};
	this.move = async function() {
		if (mainFrame.state != "Stopped") {
			if (this.currentFloor == this.targetFloor) {
				this.doorsState = true;
				this.state = "Staying with opened doors";	
				$("#animation-text").html(this.state + "<br>" + this.currentFloor);
				this.wait();
			}					
			// Moving up
			if (this.currentFloor < this.targetFloor) {
				statistic.amountOfRides++;
				this.state = "Moving up";		
				$("#animation-text").html(this.state + "<br>" + this.currentFloor);
				if (this.passengers.length > 0) {
					this.passengers.forEach(function(human) {
						human.state = "Moving up at the level of the floor " +  elevator.currentFloor;
						// GUI
						$("#passengers").children('#' + human.ID).text(human.state);
					});
				}
				await sleep(settings.speed);
				for (var i = this.currentFloor+1; i != this.targetFloor+1; i++) {	
					this.currentFloor = i;
					if (i != this.targetFloor) {
						$("#animation-text").html(this.state + "<br>" + this.currentFloor);
						if (this.passengers.length > 0) {
							this.passengers.forEach(function(human) {
								human.state = "Moving up at the level of the floor " +  elevator.currentFloor;
								// GUI
								$("#passengers").children('#' + human.ID).text(human.state);
							});
						}
						//console.log(this.currentFloor);
						//console.log("moving");
						await sleep(settings.speed);
					} else {
						this.doorsState = true;
						this.state = "Staying with opened doors";	
						// Animation
						$("#animation-text").html(this.state + "<br>" + this.currentFloor);
						// GUI
						this.passengers.forEach(function(human) {
							human.state = "Moving up at the level of the floor " +  elevator.currentFloor;
							// GUI
							$("#passengers").children('#' + human.ID).text(human.state);
						});				
						this.wait();
					}
					if (mainFrame.state == "Stopped") {
						break;
					}				
				}
			} 
			// Moving down
			if (this.currentFloor > this.targetFloor) {
				statistic.amountOfRides++;
				this.state = "Moving down";
				$("#animation-text").html(this.state + "<br>" + this.currentFloor);
				if (this.passengers.length > 0) {
					this.passengers.forEach(function(human) {
						human.state = "Moving down at the level of the floor " +  elevator.currentFloor;
						// GUI
						$("#passengers").children('#' + human.ID).text(human.state);
					});
				}
				await sleep(settings.speed);
				for (var i = this.currentFloor-1; i != this.targetFloor-1; i--) {
					this.currentFloor = i;
					if (i != this.targetFloor) {
						$("#animation-text").html(this.state + "<br>" + this.currentFloor);	
						if (this.passengers.length > 0) {
							this.passengers.forEach(function(human) {
								human.state = "Moving down at the level of the floor " +  elevator.currentFloor;
								// GUI
								$("#passengers").children('#' + human.ID).text(human.state);
							});	
						}		
						await sleep(settings.speed);
					}	else {
						this.doorsState = true;
						this.state = "Staying with opened doors";
						// Animation
						$("#animation-text").html(this.state + "<br>" + this.currentFloor);
						// GUI
						this.passengers.forEach(function(human) {
							human.state = "Moving down at the level of the floor " +  elevator.currentFloor;
							// GUI
							$("#passengers").children('#' + human.ID).text(human.state);
						});				
						this.wait();
					}
					if (mainFrame.state == "Stopped") {
						break;
					}
				}
			}
		}
	};
	this.wait =  async function() {
		if (mainFrame.state != "Stopped") {
			// Exit
			j = 0;
			if (this.passengers.length) {
				for (i = 0; i < elevator.passengers.length; i++) {
					if (elevator.passengers[i].targetFloor == elevator.currentFloor) {
						elevator.passengers[i].state = "Delivered to the target floor " + elevator.passengers[i].targetFloor;
						house.delivered.push(elevator.passengers[i]);						
						elevator.currentWeight -= elevator.passengers[i].weight;
						buttonsOfElevator[elevator.passengers[i].targetFloor-1].state = false;
						// GUI
						$("#delivered").append('<h6>' + house.delivered[j].name + '</h6><p id=' + house.delivered[j].ID + '>' + house.delivered[j].state + '</p>');
						$( "#delivered" ).accordion( "refresh" );
						$("#passengers").children('[aria-controls=' + elevator.passengers[i].ID + ']').remove();
						$("#passengers").children('#' + elevator.passengers[i].ID).remove();
						$( "#passengers" ).accordion( "refresh" );
						j++;
						delete elevator.passengers[i];
						await sleep(500);
					}
				}
				this.passengers = this.passengers.filter(function(human) {
					return human != "undefined";
				});
				setTimeout(function() { 
					house.amountOfHumans -= house.delivered.length;
					house.delivered.splice(0);
					// GUI
					$("#delivered").empty();
					$("#amount-of-humans").text(house.amountOfHumans);
				}, 2000);
			}			
			// Entrance
			j = this.passengers.length;
			for (i = 0; i < house.pending.length; i++) {
				if (house.pending[i].spawnFloor == elevator.currentFloor) {
					elevator.passengers.push(house.pending[i]);
					elevator.currentWeight += house.pending[i].weight;	
					house.pending[i].state = "Staying in elevator on " + elevator.currentFloor + " floor";							
					// GUI
					$("#passengers").append('<h6>' + elevator.passengers[j].name + '</h6><p id=' + elevator.passengers[j].ID + '>' + elevator.passengers[j].state + '</p>');
					$("#passengers").accordion("refresh");
					$("#pending").children('[aria-controls=' + house.pending[i].ID + ']').remove();
					$("#pending").children('#' + house.pending[i].ID).remove();
					$("#pending").accordion("refresh");					
					if (elevator.currentWeight >= 400) {
						elevator.indicatorState = true;
						// REALIZE LED GUI
						console.log("Overload!");			
						$("#animation-cabin").text("Indicator On");		
						// GUI
						$("#pending").append('<h6>' + elevator.passengers[j].name + '</h6><p id=' + elevator.passengers[j].ID + '>' + elevator.passengers[j].state + '</p>');
						$("#pending").accordion("refresh");						
						$("#passengers").children('[aria-controls=' + house.pending[i].ID + ']').remove();
						$("#passengers").children('#' + house.pending[i].ID).remove();
						$("#passengers").accordion( "refresh" );
						await sleep(500);
						elevator.passengers.splice(-1,1);
						elevator.currentWeight -= house.pending[i].weight;
						house.pending[i].pressSpawnFloorButton();
						elevator.indicatorState = false;
						$("#animation-cabin").text("Indicator Off");	
						j--;
					} else {		
						await sleep(500);				
						buttonsOfHouse[house.pending[i].spawnFloor-1].state = false;
						house.pending[i].pressTargetFloorButton();
						// Statistic
						statistic.sumWeight += house.pending[i].weight;
						statistic.amountOfMovedHumans++;
						delete house.pending[i];
						// GUI 
						$("#amount-of-moved").text(statistic.amountOfMovedHumans);
					}		
					j++;			
				}
			}
			house.pending = house.pending.filter(function(human) {
				return human != "undefined";
			});
			this.doorsState = false;
			this.state = "Staying with closed doors";	
			$("#animation-text").html(this.state + "<br>" + this.currentFloor);
			this.chooseNextFloor();
		}
	}
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
	this.state = "Waiting for elevator on " + this.spawnFloor + " floor";	
	this.ID = this.name + '-' + this.spawnFloor + '-' + this.targetFloor;
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
	this.amountOfMovedHumans = 0;
}