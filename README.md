# Requirements specification
Develop an application to simulate automated control system of elevators.

## House

_N_-storey building.

#### Buttons

Buttons can be in 2 states:
* Pressed
* Depressed

On each floor there is an elevator ***"Call"*** button. After pressing the ***"Call"*** button, the button is in the state *"Pressed"* until the elevator stop on this floor.

## Elevator

1 elevator.

Elevator can be in several states:
* Staying with closed doors
* Staying with opened doors
* Moving up
* Moving down

Discrete movement of the elevator. The distance between adjacent floor elevator passes in 5 seconds.

Elevator can hold several people, can move only with closed doors, can move empty.

Elevator should not start moving, if the total weight exceeds 400 kg. If the total weight exceeds 400 kg, the elevator should light LED ***"Overload"***

#### Buttons

Buttons can be in 2 states:
* Pressed
* Depressed

_N_ buttons of numbered floors in the elevator.

At each time multiple buttons can be in state *"Pressed"*. After reaching the target floor button takes state *"Depressed"*.

***"Move"*** button initiates the movement of the elevator. ***"Move"*** button doesn't have state *"Pressed"*.

## Human

Human has 3 attributes:
* Weight
* Floor on which he appeared
* Target floor

Human can be in 3 states:
* Waiting for elevator on _K_ floor
* Moving up/down at the level of the floor _K_
* Delivered to the target floor _K_

Only human can press all the buttons.

## System

The system should provide the ability to survey the position of each human at any given time. 

After delivery to the target floor human must exist in the system for another 5 seconds.

Function ***"Launch system"*** and ***"Stop system"*** should be implemented in the application. You can stop only empty elevator.

The user must be able to create objects "Human" in real time over an entire session of the system.

After stopping of the system the application should display next information:
* Total amount of rides
* Amount of empty rides
* Total moved weight
* Amount of created objects "Human" in the system

In status bar display next information:
* Amount of moving elevators
* Amount of stopped elevators
* Total amount of moved humans by elevator (including those that are currently in the elevator)
