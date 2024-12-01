# **Naval Tactical Simulator Requirements**

## **Development Environment Setup:**

This application will be developed using Test-Driven Development (TDD) principles, ensuring thorough unit testing for every function and feature.  I want industry best practices used for all set up, configuration, testing and application development using modern cross platform compatible tools.

- The application will be developed on a MacBook Air (M1) using a clean development environment.

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

	-----------------------------------------------------
	| System Menu Bar                                    |
	|----------------------------------------------------
	| Ship   | [Simulation Title]             |Right    |
	| Picker |--------------------------------|Info     |
	|        | Ocean View                     |Panel    |
	|        |                                |        |
	|        |                                |        |
	|        |                                |        |
	|        |                                |        |
	|        |                                |        |
	|        |---------------------------------        |
	|        |SSL  |Simulation Controller View |        |
	|----------------------------------------------------

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
|  Vessel | <-----------------------------------------> | ^ |
|-------------------------------------------------------| | |
|  Vessel | <-----------------------------------------> | | |
|-------------------------------------------------------| | |
|  Vessel | <-----------------------------------------> | | |
|-------------------------------------------------------| | |
|                        << [] >>                       | v |
-------------------------------------------------------------
```

- The panel represented above includes 3 vessels, but note that more or less can be shown, and should have a scroll bar on the right if the area is larger than the view window allows.
- Each Vessel Row will have a Ship Name, Course, Speed and Depth on the left side, and the rest of the row will include a timeline with flags to indicate the orders given to it (or preplanned changes) at the specific time. As the simulation runs, a vertical bar will track over the timeline to indicate the current simulation time.
- At the bottom of this control, there will be basic video-player like controls, with a back, forward, play/pause control.
- The rows are selectable, with the selected row highlighting the same vessel in the ocean view. By default, selecting a vessel will open a Ship Characteristics report on the right Info Panel

**Right Info Panel** - Can show one of the "reports" listed below
- Ship Characteristics (requires one ship selected, and is the default)
- Line of Sight Diagram (requires 2 Sim Ships selected)
- Time/Frequency Analysis
- DIMUS (Digital Multibeam Stearing) SONAR Display
- Narrowband SONAR Display

## **Right Info Panel Reports**

### Ship Characteristics

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
- Controls for issuing orders during the simulation
	- Change Course
	- Change Speed
	- Change Depth
	

### Line of Sight Diagram

TODO: Define this

### Time/Frequency Analysis

TODO: Define this

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

# **Naval Tactical Simulator - Technical Specification**

## **System Architecture**

### **Application Layers**

1. **Presentation Layer**
```typescript
// Component Architecture
interface ComponentStructure {
  // Smart Components (Container Components)
  containers: {
    SimulationContainer: React.FC<SimulationProps>;
    VesselManagerContainer: React.FC<VesselManagerProps>;
    TimelineContainer: React.FC<TimelineProps>;
  };
  
  // Dumb Components (Presentational Components)
  components: {
    VesselCard: React.FC<VesselCardProps>;
    TimelineControl: React.FC<TimelineControlProps>;
    MapOverlay: React.FC<MapOverlayProps>;
  };
}

// Event Handling
interface UIEventHandlers {
  onVesselSelect: (vesselId: string) => void;
  onTimelineUpdate: (time: number) => void;
  onOrderCreate: (order: VesselOrder) => void;
}
```

2. **Business Logic Layer**
```typescript
// Core Services
interface CoreServices {
  simulationEngine: {
    initialize: (config: SimConfig) => Promise<void>;
    start: () => void;
    pause: () => void;
    stop: () => void;
    setTimeScale: (scale: number) => void;
  };
  
  vesselManager: {
    createVessel: (vessel: VesselDTO) => Promise<Vessel>;
    updateVessel: (id: string, updates: Partial<Vessel>) => Promise<void>;
    calculateTrajectory: (vessel: Vessel, time: number) => Position;
  };
  
  acousticProcessor: {
    generateSignature: (vessel: Vessel) => AcousticSignature[];
    analyzeFrequency: (data: number[]) => FrequencyAnalysis;
  };
}

// Domain Services
interface DomainServices {
  orderProcessor: {
    validateOrder: (order: VesselOrder) => boolean;
    executeOrder: (vessel: Vessel, order: VesselOrder) => void;
  };
  
  navigationService: {
    calculateBearing: (from: Position, to: Position) => number;
    calculateDistance: (from: Position, to: Position) => number;
    predictPosition: (vessel: Vessel, time: number) => Position;
  };
}
```

3. **Data Layer**
```typescript
// Data Access Layer
interface DataAccess {
  simulationRepository: {
    save: (simulation: Simulation) => Promise<void>;
    load: (id: string) => Promise<Simulation>;
    list: () => Promise<SimulationMetadata[]>;
    delete: (id: string) => Promise<void>;
  };
  
  vesselRepository: {
    save: (vessel: Vessel) => Promise<void>;
    loadTemplate: (templateId: string) => Promise<VesselTemplate>;
    saveTemplate: (template: VesselTemplate) => Promise<void>;
  };
}

// Storage Adapters
interface StorageAdapters {
  fileSystem: {
    read: <T>(path: string) => Promise<T>;
    write: <T>(path: string, data: T) => Promise<void>;
    delete: (path: string) => Promise<void>;
  };
  
  database: {
    query: <T>(sql: string, params: any[]) => Promise<T[]>;
    execute: (sql: string, params: any[]) => Promise<void>;
  };
}
```

### **Cross-Cutting Concerns**

```typescript
// Logging System
interface LoggingSystem {
  logger: {
    info: (message: string, meta?: object) => void;
    error: (error: Error, meta?: object) => void;
    debug: (message: string, meta?: object) => void;
    warn: (message: string, meta?: object) => void;
  };
}

// Error Handling
interface ErrorHandling {
  ErrorBoundary: React.ComponentType;
  errorHandler: (error: Error) => void;
  ErrorTypes: {
    SimulationError: typeof Error;
    VesselError: typeof Error;
    NetworkError: typeof Error;
  };
}

// Security
interface Security {
  authentication: {
    login: (credentials: Credentials) => Promise<void>;
    logout: () => Promise<void>;
    validateSession: () => boolean;
  };
  
  encryption: {
    encrypt: (data: any) => Promise<string>;
    decrypt: (encrypted: string) => Promise<any>;
  };
}
```

### **Communication Patterns**

```typescript
// Event Bus
interface EventBus {
  subscribe: <T>(channel: string, handler: (data: T) => void) => () => void;
  publish: <T>(channel: string, data: T) => void;
  unsubscribe: (channel: string) => void;
}

// IPC Communication
interface IPCBridge {
  invoke: <T, R>(channel: string, data: T) => Promise<R>;
  handle: <T, R>(channel: string, handler: (data: T) => Promise<R>) => void;
  send: <T>(channel: string, data: T) => void;
  on: <T>(channel: string, handler: (data: T) => void) => void;
}
```

### **State Management Flow**

```typescript
// Action Creators
interface ActionCreators {
  simulation: {
    startSimulation: () => ThunkAction;
    updateTime: (time: number) => Action;
    setVessels: (vessels: Vessel[]) => Action;
  };
  
  vessels: {
    addVessel: (vessel: Vessel) => Action;
    updateVesselPosition: (id: string, position: Position) => Action;
    removeVessel: (id: string) => Action;
  };
}

// Middleware Chain
interface MiddlewareChain {
  logger: Middleware;
  thunk: Middleware;
  simulationProcessor: Middleware;
  errorHandler: Middleware;
}
```

### **Build and Deployment**

```typescript
// Build Configuration
interface BuildConfig {
  development: {
    devServer: WebpackDevServerConfig;
    electronConfig: ElectronDevConfig;
    envVars: EnvConfig;
  };
  
  production: {
    optimization: WebpackOptimizationConfig;
    electronBuilder: ElectronBuilderConfig;
    deployment: DeploymentConfig;
  };
}

// Deployment Pipeline
interface DeploymentPipeline {
  stages: {
    build: () => Promise<void>;
    test: () => Promise<void>;
    package: () => Promise<void>;
    deploy: () => Promise<void>;
  };
  
  artifacts: {
    generateArtifacts: () => Promise<BuildArtifacts>;
    validateArtifacts: () => Promise<void>;
  };
}
```

## **Development Environment Setup**

[Previous setup section remains unchanged...]

## **User Interface Specification**

### **System Menus**
[Previous menu structure remains unchanged...]

### **Main UI Layout**
[Previous UI layout diagram remains unchanged...]

## **Core Components & Features**

### **Map System (OceanView)**
- Interactive MapBox GL JS map display
- Ship placement and movement tracking
- Custom map controls and styling
- Coordinate display and scale controls
- Navigation tools
- Track history visualization
- Time-based position updates

### **Simulation Controller**
- Timeline-based control interface
- Per-vessel order visualization
- Playback controls (play/pause/step)
- Time scaling controls
- Order execution tracking

### **Ship Management**
- Ship type categorization
- Drag and drop placement
- Movement tracking
- Metadata display
- Search and filtering
- Ship definition management
- Acoustic signature management

[Previous Right Info Panel Reports section remains unchanged...]

## **Testing Strategy**

[Previous detailed testing section remains unchanged...]

## **Services**

### **SimulationManager**
Controls simulation lifecycle and UI state:
- Time management
- State synchronization
- Event handling
- Order processing

### **SimulationStorage**
Handles data persistence:
- `listSimulations()`: Get available simulations
- `loadSimulation()`: Load simulation data
- `saveSimulation()`: Persist changes
- `deleteSimulation()`: Remove simulation

### **ShipService**
Manages ship operations:
- Ship characteristics management
- Movement calculations
- Acoustic signature generation
- Order execution

## **Development Workflow**
1. Development server with hot reload
2. Electron environment testing
3. Production build and packaging
4. Platform-specific distribution

### **NPM Scripts**
- `start`: Development mode
- `build`: Production build
- `package`: Create distributables
- `test`: Run all tests
- `test:watch`: Run tests in watch mode
- `test:coverage`: Generate coverage report

## **Data Models**

### **Simulation Model**
```typescript
interface Simulation {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  duration: number; // in seconds
  timeScale: number;
  vessels: Vessel[];
  events: SimulationEvent[];
  bounds: GeographicBounds;
}
```

### **Vessel Model**
```typescript
interface Vessel {
  id: string;
  name: string;
  hullNumber?: string;
  type: VesselType;
  nationality: string;
  characteristics: VesselCharacteristics;
  acousticSignatures: AcousticSignature[];
  orders: VesselOrder[];
  initialPosition: Position;
}

interface VesselCharacteristics {
  maxSpeed: number;
  minSpeed: number;
  maxDepth: number;
  minDepth: number;
  turnRate: number;
  accelerationRate: number;
  depthChangeRate: number;
  propulsion: PropulsionSystem[];
}
```

### **Acoustic Models**
```typescript
interface AcousticSignature {
  id: string;
  type: 'BROADBAND' | 'NARROWBAND' | 'TRANSIENT';
  centerFrequency: number;
  bandwidth: number;
  signalStrength: number;
  // Additional type-specific properties...
}

interface PropulsionSystem {
  type: 'PROPELLER' | 'JET' | 'OTHER';
  configuration: {
    bladeCount?: number;
    bladeType?: string;
    // Other configuration options...
  };
}
```

## **State Management**

### **Redux Store Structure**
```typescript
interface RootState {
  simulation: {
    current: Simulation | null;
    isRunning: boolean;
    currentTime: number;
    selectedVessels: string[];
    timeScale: number;
  };
  vessels: {
    byId: Record<string, Vessel>;
    allIds: string[];
    loading: boolean;
    error: string | null;
  };
  ui: {
    activePanel: PanelType;
    dialogs: {
      newVessel: boolean;
      loadSimulation: boolean;
      // other dialog states...
    };
    theme: 'light' | 'dark';
  };
}
```

## **Inter-Process Communication (IPC)**

### **IPC Channels**
```typescript
// Main to Renderer
const IPC_CHANNELS = {
  SIMULATION_LOADED: 'simulation:loaded',
  SIMULATION_SAVED: 'simulation:saved',
  VESSEL_UPDATED: 'vessel:updated',
  ERROR_OCCURRED: 'error:occurred',
} as const;

// Renderer to Main
const IPC_REQUESTS = {
  LOAD_SIMULATION: 'simulation:load',
  SAVE_SIMULATION: 'simulation:save',
  UPDATE_VESSEL: 'vessel:update',
} as const;
```

## **Performance Considerations**

### **Optimization Strategies**
- Use Web Workers for complex calculations
- Implement virtual scrolling for large vessel lists
- Batch updates for vessel position changes
- Use canvas rendering for track history
- Implement proper memoization for expensive computations
- Use efficient data structures for spatial queries

### **Memory Management**
- Implement cleanup for unused resources
- Clear track history beyond certain threshold
- Unload unused vessel data
- Proper disposal of MapBox GL resources

## **Detailed Layer Architecture**

### **1. Presentation Layer Details**

```typescript
// View Models
interface ViewModels {
  VesselViewModel: {
    id: string;
    displayName: string;
    icon: string;
    status: VesselStatus;
    position: DisplayPosition;
    currentOrder?: OrderViewModel;
    isSelected: boolean;
  };

  TimelineViewModel: {
    currentTime: number;
    duration: number;
    markers: TimelineMarker[];
    scale: number;
    isPlaying: boolean;
  };

  MapViewModel: {
    center: [number, number];
    zoom: number;
    bearing: number;
    vessels: VesselMapMarker[];
    tracks: TrackLine[];
    overlays: MapOverlay[];
  };
}

// UI Components Hierarchy
interface UIComponentHierarchy {
  layout: {
    MainLayout: React.FC;
    SplitPaneLayout: React.FC<SplitPaneProps>;
    DialogContainer: React.FC<DialogProps>;
  };

  navigation: {
    MenuBar: React.FC<MenuBarProps>;
    Toolbar: React.FC<ToolbarProps>;
    Sidebar: React.FC<SidebarProps>;
  };

  simulation: {
    OceanView: React.FC<OceanViewProps>;
    TimelineControl: React.FC<TimelineProps>;
    VesselList: React.FC<VesselListProps>;
  };

  analysis: {
    FrequencyDisplay: React.FC<FrequencyProps>;
    BearingPlot: React.FC<BearingProps>;
    SignalStrength: React.FC<SignalProps>;
  };
}

// Component State Management
interface ComponentState {
  useVesselState: () => VesselStateHook;
  useTimelineState: () => TimelineStateHook;
  useMapState: () => MapStateHook;
  useSimulationState: () => SimulationStateHook;
}
```

### **2. Business Logic Layer Details**

```typescript
// Domain Models
interface DomainModels {
  // Core Simulation Models
  Simulation: {
    configuration: SimulationConfig;
    state: SimulationState;
    timeline: Timeline;
    environment: Environment;
  };

  // Vessel Domain Model
  Vessel: {
    properties: VesselProperties;
    state: VesselState;
    behavior: VesselBehavior;
    sensors: SensorArray;
  };

  // Order Domain Model
  Order: {
    type: OrderType;
    parameters: OrderParameters;
    validation: OrderValidation;
    execution: OrderExecution;
  };
}

// Business Services
interface BusinessServices {
  // Simulation Engine Services
  simulationEngine: {
    timeline: TimelineService;
    physics: PhysicsEngine;
    collision: CollisionDetection;
    environment: EnvironmentService;
  };

  // Vessel Management Services
  vesselManagement: {
    movement: MovementCalculator;
    orders: OrderProcessor;
    sensors: SensorProcessor;
    status: StatusManager;
  };

  // Analysis Services
  analysis: {
    acoustic: AcousticAnalyzer;
    trajectory: TrajectoryAnalyzer;
    contact: ContactManager;
    threat: ThreatAssessor;
  };
}

// Business Rules
interface BusinessRules {
  validation: {
    validateVesselPlacement: (position: Position, vessel: Vessel) => ValidationResult;
    validateOrder: (order: Order, vessel: Vessel) => ValidationResult;
    validateSimulationState: (state: SimulationState) => ValidationResult;
  };

  calculation: {
    calculateInterception: (tracker: Vessel, target: Vessel) => InterceptionResult;
    calculateDetectionProbability: (sensor: Sensor, target: Vessel) => DetectionProbability;
    calculateAcousticPropagation: (source: AcousticSource, medium: Medium) => PropagationResult;
  };
}
```

### **3. Data Layer Details**

```typescript
// Repository Interfaces
interface Repositories {
  // Generic Repository Pattern
  Repository<T>: {
    find: (id: string) => Promise<T>;
    findAll: (query?: Query) => Promise<T[]>;
    create: (entity: T) => Promise<T>;
    update: (id: string, entity: Partial<T>) => Promise<T>;
    delete: (id: string) => Promise<void>;
  };

  // Specific Repositories
  SimulationRepository: Repository<Simulation> & {
    saveSnapshot: (id: string, snapshot: SimulationSnapshot) => Promise<void>;
    loadSnapshot: (id: string, snapshotId: string) => Promise<SimulationSnapshot>;
  };

  VesselRepository: Repository<Vessel> & {
    findByType: (type: VesselType) => Promise<Vessel[]>;
    findByNationality: (nationality: string) => Promise<Vessel[]>;
  };
}

// Data Access Layer
interface DataAccessLayer {
  // Storage Providers
  storage: {
    local: LocalStorageProvider;
    file: FileSystemProvider;
    remote: RemoteStorageProvider;
  };

  // Data Transformers
  transformers: {
    simulationTransformer: DataTransformer<SimulationDTO, Simulation>;
    vesselTransformer: DataTransformer<VesselDTO, Vessel>;
    orderTransformer: DataTransformer<OrderDTO, Order>;
  };

  // Cache Management
  cache: {
    get: <T>(key: string) => Promise<T>;
    set: <T>(key: string, value: T, options?: CacheOptions) => Promise<void>;
    invalidate: (pattern: string) => Promise<void>;
  };
}

// Data Validation
interface DataValidation {
  schemas: {
    simulationSchema: ValidationSchema;
    vesselSchema: ValidationSchema;
    orderSchema: ValidationSchema;
  };

  validators: {
    validateSimulation: (data: unknown) => ValidationResult;
    validateVessel: (data: unknown) => ValidationResult;
    validateOrder: (data: unknown) => ValidationResult;
  };
}
```

## **Implementation Details**

### **1. Core Type Definitions**

```typescript
// Base Types
type Coordinates = [number, number];  // [longitude, latitude]
type Heading = number;  // 0-359 degrees
type Speed = number;    // knots
type Depth = number;    // meters
type Frequency = number; // Hz
type DecimalDegrees = number;
type TimeStamp = number; // Unix timestamp in milliseconds

interface Position {
  coordinates: Coordinates;
  heading: Heading;
  speed: Speed;
  depth: Depth;
  timestamp: TimeStamp;
}

interface GeographicBounds {
  northEast: Coordinates;
  southWest: Coordinates;
}

// Vessel Types and States
enum VesselType {
  SURFACE_WARSHIP = 'SURFACE_WARSHIP',
  SUBMARINE = 'SUBMARINE',
  MERCHANT = 'MERCHANT',
  FISHING = 'FISHING',
  BIOLOGIC = 'BIOLOGIC'
}

enum VesselStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MANEUVERING = 'MANEUVERING',
  DAMAGED = 'DAMAGED'
}

// Order Types
enum OrderType {
  COURSE_CHANGE = 'COURSE_CHANGE',
  SPEED_CHANGE = 'SPEED_CHANGE',
  DEPTH_CHANGE = 'DEPTH_CHANGE',
  COMPOSITE = 'COMPOSITE'
}
```

### **2. Component Implementation Requirements**

```typescript
// OceanView Component Requirements
interface OceanViewProps {
  bounds: GeographicBounds;
  vessels: VesselViewModel[];
  selectedVesselIds: string[];
  trackHistory: Record<string, Position[]>;
  onVesselSelect: (vesselId: string) => void;
  onVesselDrag: (vesselId: string, position: Coordinates) => void;
}

interface OceanViewState {
  zoom: number;
  center: Coordinates;
  bearing: number;
  pitch: number;
  isDragging: boolean;
}

// MapBox Configuration
const MAP_CONFIG = {
  style: 'mapbox://styles/mapbox/navigation-night-v1',
  minZoom: 2,
  maxZoom: 18,
  initialZoom: 10,
  trackHistoryPoints: 100,
  vesselIconSize: 24,
  trackLineWidth: 2,
  trackLineColor: '#00FF00',
  selectedVesselColor: '#FF0000'
};

// Timeline Component Requirements
interface TimelineProps {
  duration: number;
  currentTime: number;
  timeScale: number;
  isPlaying: boolean;
  markers: TimelineMarker[];
  onTimeChange: (time: number) => void;
  onPlayPause: () => void;
  onTimeScaleChange: (scale: number) => void;
}

interface TimelineMarker {
  time: number;
  type: 'ORDER' | 'EVENT';
  vesselId: string;
  description: string;
}
```

### **3. Service Implementation Requirements**

```typescript
// Simulation Engine Requirements
interface SimulationEngine {
  timeStep: number;  // milliseconds between updates
  maxTimeScale: number;
  minTimeScale: number;
  
  initialize(config: SimulationConfig): Promise<void>;
  start(): void;
  pause(): void;
  stop(): void;
  
  // Core simulation loop
  update(deltaTime: number): void;
  
  // Physics calculations
  calculateNewPosition(
    currentPosition: Position,
    order: Order,
    deltaTime: number
  ): Position;
  
  // Event handling
  processEvents(currentTime: number): void;
  
  // State management
  saveState(): SimulationState;
  loadState(state: SimulationState): void;
}

// Movement Calculator Requirements
interface MovementCalculator {
  // Turn radius calculation based on speed
  calculateTurnRadius(speed: Speed): number;
  
  // Time to complete maneuver
  calculateManeuverTime(
    current: Position,
    target: Position,
    characteristics: VesselCharacteristics
  ): number;
  
  // Generate movement path points
  generatePath(
    start: Position,
    end: Position,
    characteristics: VesselCharacteristics,
    timeStep: number
  ): Position[];
}

// Acoustic Processing Requirements
interface AcousticProcessor {
  sampleRate: number;  // Hz
  fftSize: number;     // Power of 2
  
  // Generate acoustic signature
  generateSignature(
    vessel: Vessel,
    conditions: EnvironmentalConditions
  ): Float32Array;
  
  // Process acoustic data
  processAcousticData(
    data: Float32Array,
    options: ProcessingOptions
  ): ProcessedAcousticData;
  
  // Calculate propagation loss
  calculatePropagationLoss(
    source: Position,
    receiver: Position,
    conditions: EnvironmentalConditions
  ): number;
}
```

### **4. Data Storage Requirements**

```typescript
// File System Structure
interface FileSystemStructure {
  root: string;
  paths: {
    simulations: string;
    vessels: string;
    templates: string;
    snapshots: string;
    logs: string;
  };
  extensions: {
    simulation: '.sim';
    vessel: '.vessel';
    snapshot: '.snap';
    log: '.log';
  };
}

// Data Storage Format
interface SimulationFile {
  version: string;
  metadata: SimulationMetadata;
  configuration: SimulationConfig;
  vessels: VesselData[];
  events: SimulationEvent[];
  environment: EnvironmentData;
}

// Storage Providers Configuration
interface StorageConfig {
  local: {
    basePath: string;
    maxSize: number;  // bytes
    compression: boolean;
  };
  remote: {
    endpoint: string;
    timeout: number;  // milliseconds
    retryAttempts: number;
  };
}
```

### **5. UI/UX Requirements**

```typescript
// Theme Configuration
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    warning: string;
    success: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  spacing: {
    unit: number;
    sizes: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  typography: {
    fontFamily: string;
    sizes: {
      h1: number;
      h2: number;
      h3: number;
      body: number;
      small: number;
    };
  };
}

// Dialog Configurations
interface DialogConfig {
  newVessel: {
    width: number;
    height: number;
    fields: FormFieldConfig[];
    validations: ValidationRules;
  };
  loadSimulation: {
    width: number;
    height: number;
    listItemHeight: number;
    maxItems: number;
  };
}
```

### **6. Performance Requirements**

```typescript
// Performance Thresholds
const PERFORMANCE_THRESHOLDS = {
  targetFPS: 60,
  maxVessels: 100,
  maxTrackPoints: 1000,
  maxEventListeners: 10,
  workerPoolSize: 4,
  
  timing: {
    maxFrameTime: 16.67,  // ms (1/60 sec)
    maxUpdateTime: 8.33,  // ms (half of frame time)
    maxRenderTime: 8.33,  // ms (half of frame time)
  },
  
  memory: {
    maxHeapSize: 512 * 1024 * 1024,  // 512MB
    gcThreshold: 0.9,  // 90% of max heap
  },
  
  caching: {
    vesselDataTTL: 300000,  // 5 minutes
    simulationDataTTL: 600000,  // 10 minutes
    maxCacheSize: 50 * 1024 * 1024,  // 50MB
  }
} as const;

// Worker Configuration
interface WorkerConfig {
  pools: {
    calculation: number;
    acoustic: number;
  };
  messageTimeout: number;
  maxRetries: number;
}
```

## **Initial Setup Instructions**

### **1. Project Initialization**
```bash
# Create and enter project directory
mkdir naval-tactical-simulator
cd naval-tactical-simulator

# Initialize git
git init

# Initialize npm project
npm init -y
```

### **2. Dependencies Installation**
```bash
# Install primary dependencies
npm install --save \
  electron \
  react \
  react-dom \
  @reduxjs/toolkit \
  react-redux \
  react-router-dom \
  mapbox-gl \
  electron-store \
  typescript \
  @types/react \
  @types/react-dom \
  @types/node

# Install development dependencies
npm install --save-dev \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  electron-builder \
  eslint \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  prettier \
  husky \
  jest \
  @types/jest \
  ts-jest \
  webpack \
  webpack-cli \
  webpack-dev-server \
  ts-loader \
  css-loader \
  style-loader \
  html-webpack-plugin \
  @electron/rebuild
```

### **3. Project Structure**
```bash
# Create directory structure
mkdir -p src/{components,services,store,types,hooks,constants,config,assets,i18n,electron/{preload,main},validation,api} \
       public \
       specs \
       tests/{unit,integration,e2e,helpers}
```

### **4. Configuration Files**

#### **TypeScript Configuration (tsconfig.json)**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "jsx": "react-jsx",
    "outDir": "./dist",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  },
  "include": ["src"]
}
```

#### **Webpack Configuration (webpack.config.js)**
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
```

### **5. Initial Source Files**

#### **public/index.html**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Naval Tactical Simulator</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

#### **src/index.tsx**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

#### **src/electron/main/index.ts**
```typescript
import { app, BrowserWindow } from 'electron';
import path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8080');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

### **6. Package.json Scripts**
```json
{
  "scripts": {
    "start": "electron-builder dev",
    "build": "webpack --mode production && electron-builder build",
    "test": "jest",
    "dev": "webpack serve --mode development",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}
```

### **7. Git Configuration**

#### **.gitignore**
```
node_modules/
dist/
build/
.DS_Store
*.log
coverage/
```

### **8. Development Workflow**
To start development:
```bash
# In one terminal:
npm run dev

# In another terminal:
npm start
```

This will start the development environment with hot reloading enabled.

