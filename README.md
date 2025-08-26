# TaskFlow - Personal Kanban Board

A professional, single-user Kanban-style task board built with React, TypeScript, and Tailwind CSS. Features a modern UI with persistent state management and intuitive drag-and-drop functionality.

## Features

### Core Functionality ✅
- **Professional 3-column layout**: To Do, In Progress, Done with gradient headers and emoji icons
- **Enhanced task creation** with professional form, character counters, and validation  
- **Smooth drag and drop** with visual feedback, animations, and hover effects
- **Improved inline editing** with better UX, save/cancel buttons, and form validation
- **Smart task deletion** with confirmation dialogs and contextual actions
- **Automatic persistence** using localStorage - all changes saved instantly

### Enhanced User Experience ✅
- **Modern sidebar navigation** with collapsible mobile menu and overlay
- **Real-time progress tracking** in header with visual progress bar and task counts
- **Smart task statistics** showing live counts per column with color coding
- **Advanced search functionality** with clear filters, live results, and search hints
- **Rich activity history** with action icons, relative timestamps, and color categorization
- **Professional task cards** with status indicators, hover animations, and micro-interactions
- **Fully responsive design** optimized for desktop, tablet, and mobile devices
- **Polished interactions** with smooth transitions and professional animations throughout

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode for development
npm run test:watch

# Run specific test pattern
npm test -- --testPathPattern="taskUtils"
```

## Usage

### Adding Tasks
1. Click the "Add new task" button
2. Enter a task title (required)
3. Optionally add a description
4. Click "Add Task" or press Enter

### Managing Tasks
- **Edit**: Click the edit icon (pencil) on any task to edit its title inline
- **Delete**: Click the trash icon to delete a task
- **Move**: Drag tasks between columns or reorder within a column
- **Filter**: Use the search box to filter tasks by title or description

### Task History
- View recent activity in the collapsible "Recent Activity" section
- Shows the last 5 actions with timestamps
- Automatically tracks task creation, updates, deletions, and moves

## Project Structure

```
src/
├── components/                    # React components
│   ├── __tests__/                # Component tests
│   │   ├── AddTaskForm.test.tsx  # UI integration tests
│   │   ├── SearchFilter.test.tsx # Search component tests
│   │   ├── TaskCard.test.tsx     # Task card component tests
│   │   └── TaskHistory.test.tsx  # History component tests
│   ├── AddTaskForm.tsx           # Form for creating new tasks
│   ├── Column.tsx                # Individual column component
│   ├── KanbanBoard.tsx           # Main board with drag & drop
│   ├── SearchFilter.tsx          # Search/filter component
│   ├── TaskCard.tsx              # Individual task component
│   └── TaskHistory.tsx           # Activity history component
├── context/                      # State management
│   ├── __tests__/               # Context tests
│   │   └── kanbanContest.test.ts # Context provider tests
│   └── KanbanContext.tsx        # React Context + useReducer
├── hooks/                        # Custom React hooks
│   ├── __tests__/               # Hook tests
│   │   └── useKanban.test.tsx   # Custom hook tests
│   └── useKanban.ts             # Custom hook for Kanban context
├── services/                     # Business logic services
│   ├── __tests__/               # Service tests
│   │   └── TaskService.test.ts  # Pure logic tests for task operations
│   └── TaskService.ts           # Task business logic and operations
├── utils/                        # Utility functions
│   ├── __tests__/               # Utility tests
│   │   └── taskUtils.test.ts    # Pure logic tests for utilities
│   └── taskUtils.ts             # Task filtering, validation, formatting
├── types/
│   └── index.ts                 # TypeScript type definitions
├── App.tsx                      # Root component
├── main.tsx                     # Entry point
├── setupTests.ts                # Test configuration
└── index.css                    # Global styles with Tailwind
```

## Architecture & Design

### State Management
The app uses React Context with useReducer for state management:

- **Tasks**: Array of all tasks with metadata
- **Columns**: Structure defining the three columns
- **Filter**: Current search filter
- **History**: Last 5 actions for activity tracking

All state changes are automatically persisted to localStorage and restored on page reload.

### Business Logic Separation
- **Services**: Pure business logic classes for task operations
  - `TaskService`: Task CRUD operations, searching, sorting, age calculation
- **Utils**: Utility functions for filtering, validation, and formatting
  - `taskUtils`: Task filtering, validation, date formatting, grouping
- **Components**: UI-focused React components with minimal logic
- **Hooks**: Custom React hooks for state management integration

### Key Architectural Benefits
- **Testable**: Business logic separated from UI for easy unit testing
- **Maintainable**: Clear separation of concerns and single responsibility
- **Reusable**: Utility functions and services can be used across components
- **Type-Safe**: Full TypeScript coverage with strict type checking
- **Performance**: Pure functions enable better optimization and caching

## Testing Strategy

The project includes comprehensive testing with **80 test cases** across multiple layers:

### Pure Logic Tests (Fast & Reliable)
- **`TaskService.test.ts`**: Tests task creation, updates, searching, sorting
- **`taskUtils.test.ts`**: Tests filtering, validation, date formatting
- **`useKanban.test.tsx`**: Tests custom hooks without UI rendering

### Integration Tests
- **Component tests**: Test UI interactions and user workflows
- **Context tests**: Test state management and data flow

### Test Coverage
- **Total Test Suites**: 10 passed ✅
- **Total Tests**: 80 passed ✅
- **Execution Time**: ~10 seconds
- **Focus**: Business logic testing without UI overhead

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- taskUtils.test.ts
```