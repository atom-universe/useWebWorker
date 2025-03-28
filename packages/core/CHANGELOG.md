# Changelog

# [2.0.0](https://github.com/CoderSerio/useWebWorker/compare/v1.0.2...v2.0.0) (2025-03-28)

### Features

- **core:** major API refactor and documentation update ([b823ad7](https://github.com/CoderSerio/useWebWorker/commit/b823ad7f3159a03abf14b4fc2d3259eaea2d7606))

### BREAKING CHANGES

- **core:** Rename useWebWorkerFn to useWebWorker as default export

* Rename useWebWorkerFn to useWebWorker as the default export
* Remove file-based worker API in favor of function-based API
* Update API to use array destructuring for better ergonomics
* Improve type safety with automatic type inference
* Add built-in timeout handling
* Add comprehensive error handling with customizable callbacks
* Add support for external and local dependencies
* Add automatic cleanup of worker resources
* Add memory leak prevention
* Update documentation to reflect new API
* Add detailed feature explanations
* Add Chinese documentation
