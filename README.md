# Naval Tactical Simulator

A sophisticated web-based naval tactical simulation system built with Next.js and TypeScript. This application allows users to create and manage naval simulations with real-time map visualization and vessel management.

## Features

- **Simulation Creation**: Create new simulations with customizable parameters
  - Set simulation name and description
  - Define start time and duration
  - Select geographical area using interactive map
- **Interactive Map**: Powered by Mapbox GL
  - Real-time map navigation and zoom
  - Geographic coordinate selection
  - Visual representation of vessels
- **Vessel Management**:
  - Multiple vessel categories (Surface Warships, Submarines, Merchants, Biologics)
  - Detailed vessel information and specifications
  - International vessel selection (US, UK, China, Russia, etc.)
- **Simulation Controls**:
  - Timeline-based playback system
  - Pause, play, and speed controls
  - Real-time state management

## Technology Stack

- **Frontend**:
  - Next.js 14
  - TypeScript
  - React
  - Redux Toolkit for state management
  - Tailwind CSS for styling
- **Map Integration**:
  - Mapbox GL JS
- **Testing**:
  - Jest
  - React Testing Library
  - End-to-end test coverage

## Getting Started

### Prerequisites

- Node.js v18.19.0 or higher
- npm or yarn
- A Mapbox API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/naval-tactical-simulator.git
   cd naval-tactical-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Mapbox API key:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
naval-tactical-simulator/
├── src/
│   ├── app/                 # Next.js pages and layouts
│   ├── components/          # React components
│   │   ├── dialogs/        # Dialog components
│   │   ├── map/           # Map-related components
│   │   ├── ship-picker/   # Vessel selection components
│   │   └── ship-details/  # Vessel information components
│   ├── store/              # Redux store configuration
│   ├── types/              # TypeScript type definitions
│   ├── data/               # Static data and configurations
│   └── __tests__/          # Test suites
├── public/                 # Static assets
└── package.json           # Project dependencies and scripts
```

## Features in Development

- Advanced vessel movement patterns
- Environmental conditions simulation
- Multi-player support
- Scenario saving and loading
- Advanced sensor and weapons simulation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 