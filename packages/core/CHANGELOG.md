# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0](https://github.com/CoderSerio/useWebWorker/compare/v1.0.2...v2.0.0) (2024-03-28)

### Changed

- Renamed `useWebWorkerFn` to `useWebWorker` as the default export
- Removed the file-based worker API in favor of the function-based API
- Updated the API to use array destructuring for better ergonomics
- Improved type safety with automatic type inference

### Added

- Built-in timeout handling
- Comprehensive error handling with customizable callbacks
- Support for external and local dependencies
- Automatic cleanup of worker resources
- Memory leak prevention

### Removed

- File-based worker API
- Legacy `useWebWorker` API

## [1.0.2] - 2024-03-25

### Fixed

- Fixed timeout handling in worker status management
- Improved error handling in worker communication
- Fixed type definitions for worker status

## [1.0.1] - 2024-03-24

### Added

- Added support for local function dependencies
- Added support for external dependencies
- Added timeout option for long-running operations

### Changed

- Improved error handling with more detailed error messages
- Enhanced type safety with better TypeScript support

## [1.0.0] - 2024-03-24

### Added

- Initial release
- Function-based Web Worker API
- TypeScript support
- Automatic cleanup on unmount
- Basic error handling

## [0.0.2] - 2024-03-05

### Added

- Added Chinese README documentation
- Added comprehensive Web Worker examples
- Added createWorkerBlobUrl utility function

### Changed

- Updated package names for better clarity
- Restructured project for monorepo setup
- Updated build and development configurations
- Cleaned up and improved README documentation
- Removed unused Rollup plugins and tsup configuration

### Fixed

- Fixed example script in package.json
- Fixed documentation structure and clarity

## [0.0.1] - 2024-03-05

### Added

- Initial project setup
- Basic Web Worker functionality
- TypeScript support
- Basic documentation
