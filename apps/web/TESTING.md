# Testing Documentation

This document describes the testing setup.

## Testing Strategy

We use two types of tests:

1. **Unit Tests (Jest)**: For testing the React components in isolation
2. **E2E Tests (Playwright)**: For testing the actual functionality in the browser

## Setup

### Unit Tests (Jest)

The unit tests use Jest with the following setup:

- Tests are located in `src/components/__tests__/*.test.js`
- Jest is configured to ignore any `.spec.ts` files (which are used for Playwright tests)
- We use JSDOM to simulate a browser environment
- We mock the Splide library to test the component initialization

To run unit tests:

```bash
npm run test:unit
```

### End-to-End Tests (Playwright)

The E2E tests use Playwright with the following setup:

- Tests are located in `tests-e2e/*.spec.ts`
- We use Safari (WebKit) for testing as specified in the project requirements
- Tests verify that:
  - Splide carousels are properly initialized
  - Slides are correctly displayed
  - Navigation arrows are present

To run E2E tests:

```bash
npm run test:e2e
```

To run E2E tests with a UI:

```bash
npm run test:e2e:ui
```

To run all tests (both unit and E2E):

```bash
npm run test:all
```

## Test Files

### Unit Tests

- `src/components/__tests__/SplideInit.test.js`: Tests the SplideInit component that initializes Splide carousels

### E2E Tests

- `tests-e2e/splide.spec.ts`: E2E tests for the Splide carousel functionality

## Notes

- The E2E test for the readme-port page is currently skipped due to timeout issues with that specific page.
- Playwright tests require build and serve commands to be run before testing.
- Jest is configured to exclude E2E test files in the `jest.config.ts` file. 