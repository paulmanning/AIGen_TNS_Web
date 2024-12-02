# **Naval Tactical Simulator Requirements**

## **Development Environment Setup:**

This application will be developed using Test-Driven Development (TDD) principles, ensuring thorough unit testing for every function and feature.  I want industry best practices used for all set up, configuration, testing and application development using modern cross platform compatible tools.

- The application will be developed on a MacBook Air (M1) using a clean development environment.

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   └── simulation/        # Simulation page and routing
├── components/            # React components
│   ├── dialogs/          # Modal dialogs (NewSimulation)
│   ├── layout/           # Layout components
│   ├── map/             # Map and marker components
│   │   ├── DroppableMapOverlay.tsx  # Drop zone for ships
│   │   ├── MapComponent.tsx         # Main map implementation
│   │   └── ShipMarker.tsx          # NATO-style ship markers
│   ├── ship-details/    # Vessel information display
│   ├── ship-picker/     # Vessel selection and drag/drop
│   │   ├── ShipPicker.tsx          # Ship selection interface
│   │   └── CustomDragLayer.tsx     # Drag preview handling
│   ├── simulation/      # Simulation controls
│   └── ui/              # Common UI components
│       └── CollapsiblePanel.tsx    # Collapsible side panels
├── store/                # Redux store and slices
│   └── simulationSlice.ts  # Simulation state management
├── types/                # TypeScript definitions
│   └── simulation.ts     # Core type definitions
├── utils/                # Utility functions
│   └── ship-icons.ts     # Ship icon generation
└── data/                # Static data and ship definitions
```

Key Components:
- **app/**: Next.js 14 app router structure
- **components/**: React components organized by feature
- **map/**: Mapbox integration and ship visualization
- **ship-picker/**: Drag and drop ship management
- **store/**: Redux state management
- **types/**: TypeScript type definitions
- **data/**: Static ship and simulation data

Current Implementation Focus:
- Map visualization and interaction
- Ship management and placement
- Basic simulation setup
- Drag and drop functionality
- NATO standard ship markers

### **Setup Process:**

 1. Ensure that the development environment starts from an empty directory.
 2. Install the necessary dependencies using a package manager (e.g., Homebrew) to maintain a clean and isolated environment.
 3. Configure the Electron application to run in development mode, allowing for immediate feedback when changes are made to the files.
 4. Install Cursor.ai IDE and configure it to support TDD development. Create a unique workspace for the application and place its configuration file in a subfolder.
 5. create setup scripts for later use that are stored in a devsetup folder

### **Version Control:**

 1. Create a Git repository and initialize it with the project code.
 2. Push the initial commit to a GitHub repository.
 3. Create a comprehensive README.md file that includes project overview, installation instructions, and documentation.
 4. Documentation should be created from specifications given and generated from code comments during build. 
 5. Develop a markdown-based specification document that will be updated with every change. Include a change log markdown file that describes each change as it is made.
 6. Configure GitHub to automatically build and run unit tests on commits. Additionally, display the test result status on the GitHub repository.

[[TMA Simulator User Interface]]

## Main UI Specification
The electron page will be laid out as follows:

## **System Menus**

The application uses the following menu structure:

### File Menu
- New Simulation (Ctrl/Cmd + N)
- Load Simulation (Ctrl/Cmd + O)
- Close Simulation
- ---
- Create New Ship
- Load Ship
- Edit Ship
- Unload Ship
- ---
- Quit (Cmd+Q on Mac, Alt+F4 on Windows)

### Edit Menu
- Cut (Ctrl/Cmd + X)
- Copy (Ctrl/Cmd + C)
- Paste (Ctrl/Cmd + V)
- ---
- Undo (Ctrl/Cmd + Z)
- Redo (Ctrl/Cmd + Shift + Z)

### Simulation Menu
- Start
- Stop
- Pause
- Restart

### View Menu
- Show/Hide Ship Picker [checkbox]
- Show/Hide Ocean View [checkbox]
- ---
- Line of Sight Diagram
- Time Frequency Analysis
- DIMUS Display
- Narrowband Display
- ---
- Show Debug Console [checkbox]

# Main UI Layout

+----------------------------------------------------+
| System Menu Bar                                    |
+----------------------------------------------------+
| Ship   | [Simulation Title]             | Right    |
| Picker |--------------------------------| Info     |
|        | Ocean View                     | Panel    |
|        |                                |          |
|        |                                |          |
|        |                                |          |
|        |                                |          |
|        |                                |          |
|        |--------------------------------|          |
|        | SSL  | Simulation Controller   |          |
+----------------------------------------------------+

# Main UI Description

## Control List

**System Menu Bar**
Displays the menu items to control the simulation, load, save, edit and views
**Ship Picker**
- Closable panel used to add/edit/view ships that can be used in the simulator.
- Search bar at the top, and can be grouped by the type of vessel (Surface Warship, Commercial Ship, Submarine, Biologic, Aircraft)
- Ships can be dragged from this panel to the ocean view to drop at a specific location on the map view for setup of initial vessel positions, or added at a specific time of the simulation timespan. (imagine a ship firing a torpedo 15 minutes in to the simulation)
- Buttons at the bottom of this panel are used to create vessels, or delete vessels.
- Mouse over a ship in the picker to render a small edit icon, which will open a dialog to edit the ship.
- New Ships are created via pop-up dialog. New Ship dialog is described elsewhere.
	- Consider a means to save/load ships or sets of ships
**Ocean View**
- The ocean view has a prominent title bar at the top showing the current simulation name
- The title bar spans the width of the ocean view panel
- Below the title is the primary overhead view of the simulation at any point in time during the simulation timespan. The point of time viewed is managed by the Simulation controller, which is similar to a video player
	- The Ocean view will render a "map-like" view of the ships positions in the ocean, including past tracks for each ship. Map details will be based on a real square of the earth oceans, and may include islands/land masses, and depth markers
	- When the simulation is running, the ocean view updates every second to show the current position of all the ships included in the simulation timeline.
**Sim Ships List (SSL)**
- This is a simplified list of ships that are included in the simulation timespan, and should display a simplified bit of information about each ship at the current time of the simulation run. Course, Speed, Depth, and a current Order (if any). This mini-panel is the left side of the Simulation Controller view, with each vessel having its own row on the simulation controller view
	- Icon (Larger Font) - Vessel Name (larger font)
	- Course/Speed/Depth (tiny font)
	- Current Executing Order (or blank if none)(tiny font)

 **Simulation Controller view**
- This panel is anchored to the bottom of the ocean view and is the width of the ocean view window.
- The panel is made as follows:
```
-------------------------------------------------------------
|  Vessel | <-----------------|------------------------> | ^ |
|--------------------------------------------------------| | |
|  Vessel | <-----------------|------------------------> | | |
|--------------------------------------------------------| | |
|  Vessel | <-----------------|------------------------> | | |
|--------------------------------------------------------| | |
|                        << [] >>                        | v |
--------------------------------------------------------------
```

- The panel represented above includes 3 vessels, but note that more or less can be shown, and should have a scroll bar on the right if the area is larger than the view window allows.  The number of vessels is based on the number of vessels dragged into the ocean view.
- Each Vessel Row will have a Ship Name, Course, Speed and Depth on the left side, and the rest of the row will include a timeline with flags to indicate the orders given to it (or preplanned changes) at the specific time. As the simulation runs, a vertical bar will track over the timeline to indicate the current simulation time.
- At the bottom of this control, there will be basic video-player like controls, with a back, forward, play/pause control.
- The rows are selectable, with the selected row highlighting the same vessel in the ocean view. By default, selecting a vessel will open a Ship Characteristics detail report on the right Info Panel
- Clicking on a vessel in the map will highlight the same vessel in the SSL, opening the Ship Characteristics detail report on the right Info Panel

**Right Info Panel** - Can show one of the "reports" listed below
- Ship Characteristics Detail (requires one ship selected, and is the default)
- Line of Sight Diagram (requires 2 Sim Ships selected)
- Time/Frequency Analysis
- DIMUS (Digital Multibeam Stearing) SONAR Display
- Narrowband SONAR Display

## **Right Info Panel Reports**

### Ship Characteristics Detail Report

When selecting a vessel from the ship picker the following information will be shown:
- Icon representing country of origin flag, or if not appropriate, an icon representing the type of vessel or biologic
- Ship Name/Hull Number
- Ship Location Lat/Lon
- Current Course
- Current Speed
- Current Depth
- Current Executing Order
- Ship characteristics
	- Movement Change Rates (Turn/Speed/Depth)
	- Number of propellors/propellor types/blades/blade types
	- Max/Min Limits of speed, depth
- Frequency Characteristics
	- Broadband frequencies
		- Center Frequency
		- Bandwidth
		- Pulse Repetition Frequency [optional]
		- Pulse Duration [optional]
		- Pulse Repetition Interval [optional]
		- Signal Strength [optional]
	- Narrowband frequencies
		- Center Frequency
		- Bandwidth
		- Drift Rate [optional]
		- Drift Minimum/Maximum [optional]
		- Signal Strength


When selecing a vessel in the SSL or the map, add the following to the top of the ships characteristics detail report in its own section:
- Current Course
- Current Speed
- Current Depth
- Current Executing Order

### Line of Sight Diagram

This is a standard military LOS diagram, with the following additional details:
- The LOS diagram will be shown in a separate panel and when viewed will collapse the Ship Characteristics Detail Report
- The LOS Diagram will allow the user to choose 2 vessels via 2 dropdowns, one for the top of the diagram, and the other for the bottom of the diagram, and then render a military spec LOS diagram for the 2 vessels.
- That diagram will update as the simulation runs, showing the LOS at the current simulation time.
- If the simulation is paused, the diagram will be set for the last calculated position, and will not update unless the simulation is restarted.


### Time/Frequency Analysis

The Time/Frequency Analysis panel provides a sophisticated waterfall display similar to what submarine sonar technicians use to analyze acoustic signatures:

#### Display Layout
```
+--------------------------------------------------------+
|                     Current Time Bar                     |
|--------------------------------------------------------|
|Time    Frequency (Hz) -->                               |
|(min)   0        500       1k        1.5k       2k      |
|   ^    |         |         |         |         |       |
|   |    |         |         |         |         |       |
|   0-   ..........|.........|.........|.........|       |
|   |    |         |         |         |         |       |
|   5-   ..........|.........|.........|.........|       |
|   |    |         |         |         |         |       |
|  10-   ..........|.........|.........|.........|       |
|   |    |         |         |         |         |       |
|  15-   ..........|.........|.........|.........|       |
|        |         |         |         |         |       |
+--------------------------------------------------------+
|     << [] >> | Speed: 1x | Scale: 0dB to -90dB        |
+--------------------------------------------------------+
```

#### Core Features
- Waterfall display showing time vs. frequency
- Newest data at bottom, scrolling upward
- plot a single frequency on the waterfall display, based on a selected vessel and narrowband signature item
- Frequency range: automatically calculated based on the narrowband signature item and has a width +/- 50% of the center frequency
- Time window: 15 minutes (adjustable)
- Track the following frequencies:
    - Received Frequency
    - Base frequency
    - Ships impact on received frequency
#### Display Elements
1. **Time Axis (Y-axis)**
   - Linear scale, descending (newest at bottom)
   - Major gridlines at 1-minute intervals
   - Minor gridlines at 15-second intervals
   - Scrolling upward with simulation time
   - Time window adjustable (5-60 minutes)

2. **Frequency Axis (X-axis)**
   - Logarithmic scale
   - Major gridlines calculated based on the narrowband signature item
   - Minor gridlines calculated at 10% of the frequency range
   - Adjustable range with zoom controls


#### Interactive Features
1. **Mouse Controls**
   - Click and drag to measure frequency/time differences
   - Hover for detailed signal information:
     - Exact frequency
     - Time stamp
   - Zoom controls for both axes
   - Pan controls when zoomed

### Broadband DIMUS Sonar Display

TODO: Define this

### Narrowband Sonar Display

TODO: Define this

## New/Edit Ship Dialog

- Ability to define the name, hull number, choose nationality for icon, ship characteristics, and acoustic signature items.
- Ability to enter a list of orders that will correspond to events that will change over the run of the simulation. An order consists of a time and an order ("Change Course Right to 335", "Increase speed to 15 knots", etc.) Orders will be described elsewhere.
- Ability to enter sets of acoustic signature items. These are sounds that the vessel makes, and can be a variety of types. Broadband signals, stable and unstable tonals, transient noises (like a dropped wrench, or a sound associated with a maneuver)
- Save/Cancel buttons

## Testing Strategy

### Unit Tests
The application uses Jest for unit testing. Key test areas include:

### Test Organization
- Unit tests are located next to the files they test in `__tests__` directories
- E2E tests are located in the `test/e2e` directory
- Test helpers are provided in `test/e2e/helpers`

### Running Tests
- `npm test` - Run all unit tests
- `npm run test:watch` - Run unit tests in watch mode

#### 2.3 Simulation Controller
The Simulation Controller is a sophisticated timeline-based interface for managing the simulation:

```
-------------------------------------------------------------
|  Vessel | <-----------------------------------------> | ^ |
|-------------------------------------------------------| | |
|  Vessel | <-----------------------------------------> | | |
|-------------------------------------------------------| | |
|  Vessel | <-----------------------------------------> | | |
|-------------------------------------------------------| | |
|                        << [] >>                       | v |
-------------------------------------------------------------
```

##### Timeline Interface
- Per-vessel timeline tracks showing:
  - Ship name and basic info
  - Course/Speed/Depth indicators
  - Event flags for orders and changes
  - Current time indicator (vertical tracking bar)
- Scrollable interface for multiple vessels
- Time-based event markers
- Video player-style controls (play, pause, forward, back)

##### Sim Ships List (SSL)
Compact vessel information display:
- Icon and vessel name (larger font)
- Course/Speed/Depth (compact display)
- Current order status
- Selection highlighting with map synchronization

##### Future State Features
- Pre-planned order implementation
- Time-based event scheduling
- Order execution visualization
- Multiple timeline tracks
- Event flag system for:
  - Course changes
  - Speed adjustments
  - Depth modifications
  - Equipment state changes
  - Acoustic events

### 6. Future Implementation Plans

#### 6.1 Advanced Simulation Features
- Time-based event scheduling
- Pre-planned vessel movements
- Complex order sequences
- Environmental condition changes
- Multiple scenario support

#### 6.2 Analysis Tools
- Line of Sight Analysis
  - Inter-vessel visibility calculations
  - Terrain obstruction
  - Weather effects
- Time/Frequency Analysis
  - Acoustic signature processing
  - Frequency tracking
  - Signal strength analysis
- SONAR Displays
  - DIMUS (Digital Multibeam Steering)
  - Narrowband processing
  - Broadband analysis
  - Target tracking


