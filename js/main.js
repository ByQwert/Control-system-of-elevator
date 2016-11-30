// $(function() {

	// Add
	function getRandomInt(min, max) {
  	return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	// GUI
	$( "#generate" ).dialog({
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
        window.close();
      }
    }
  });

	// Classes
	function MainFrame() {
		this.generate = function(floors,humans) {
			//console.log(floors,humans);
			house = new House(floors,humans);
			for (var i = 0; i < house.amountOfHumans; i++) {
				humanity.push(new Human(names[getRandomInt(0,names.length-1)]));
			}
			elevator = new Elevator();
			//$("#stats").text("");
			$(".stats-table").show();
			$("#amount-of-floors").text(house.amountOfFloors);
			$("#amount-of-humans").text(house.amountOfHumans);
		};
		this.launchSystem = function() {

		};
		this.stopSystem = function() {

		};
		this.createHuman = function() {

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
		this.currentFloor;
		this.doorState;
		this.state;
		this.passengers;
		this.chooseNextFloor = function() {

		};
		this.wait = function() {

		};
		this.move = function() {

		};
	}

	function Human(name) {
		this.weight;
		this.spawnFloor;
		this.targetFloor;
		this.name = name;
		this.pressMoveButton = function() {

		};
		this.wait = function() {

		}
	}

	// Init
	var mainFrame = new MainFrame();
	var humanity = [],
    	names = ["Bob","Tom", "Mike", "Sam", "Jack", "Steve", "Anton"];


// });

