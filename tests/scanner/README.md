# Scanner tests

This directory contains test cases for the media scanner.

Each test case is placed in its own directory, and is then detected and executed 
as a test case in `scanner.test.ts`. Each test case is structured as:

* `staging/` staging media library
* `production/` production media library
* `expected.json` expected library scan output
