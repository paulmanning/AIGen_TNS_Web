# Naval Tactical Simulator

A sophisticated web-based naval tactical simulation system built with Next.js and TypeScript. This application provides real-time visualization and management of naval simulations with an emphasis on vessel movement and tactical scenarios.

For detailed technical specifications and UI requirements, see [specification.md](specification.md).
For comprehensive testing documentation, see [testing.md](testing.md).

## Features

### Core Functionality
- **Interactive Map Interface**
  - Powered by Mapbox GL JS
  - Real-time map navigation with zoom and pan controls
  - Coordinate display system
  - Custom map styling for naval operations
  - Drag and drop ship placement
  - NATO APP-6/MIL-STD-2525 style markers

- **Simulation Management**
  - Create and configure new simulations
  - Set simulation parameters (name, description, duration)
  - Define geographical area of operations
  - Real-time state persistence
  - Collapsible control panels

- **Vessel System**
  - Multiple vessel categories:
    - Surface Warships
    - Submarines
    - Merchant Vessels
    - Fishing Vessels
    - Biological Entities
  - Detailed vessel characteristics
  - International vessel database
  - Custom vessel icons with nationality flags
  - Random course generation
  - Consistent marker sizes with separate arrow rotation

### Technical Features
- Modern React architecture with Next.js 14
- Type-safe development with TypeScript
- Global state management with Redux Toolkit
- Responsive design with Tailwind CSS
- React DnD for drag and drop operations
- Local storage persistence
- Comprehensive testing with Vitest

## Getting Started

### Prerequisites
- Node.js 18.19.0 or higher
- npm or yarn
- Mapbox API token

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

3. Set up environment variables:
   - Create a `.env.local` file in the project root
   - Add your Mapbox token:
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Commands

```bash
# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run development server with test watcher
npm run dev:test

# Run development server with full test suite
npm run dev:full

# Run linter
npm run lint
```

### Testing

The project uses Vitest as its testing framework. For detailed testing documentation, standards, and practices, see [testing.md](testing.md).

Key features include:
- Fast, modern test runner with native TypeScript support
- Real-time test feedback during development
- Interactive testing UI with @vitest/ui
- Comprehensive test coverage reporting
- Integration with React Testing Library
- Mocked environment for Next.js App Router and Mapbox GL

Quick start:
```bash
# Run tests with minimal output
npm run test:min

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui

# Run tests in watch mode with dev server
npm run dev:test
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── dialogs/          # Modal dialogs
│   ├── layout/           # Layout components
│   ├── map/             # Map and marker components
│   ├── ship-details/    # Vessel information
│   ├── ship-picker/     # Vessel selection and drag/drop
│   ├── simulation/      # Simulation controls
│   └── ui/              # Common UI components
├── store/                # Redux store setup
├── types/                # TypeScript definitions
├── utils/                # Utility functions
└── data/                # Static data and ship definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Maps powered by [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js)
- UI styled with [Tailwind CSS](https://tailwindcss.com/)
- Drag and Drop powered by [React DnD](https://react-dnd.github.io/react-dnd/)
- Testing powered by [Vitest](https://vitest.dev/)