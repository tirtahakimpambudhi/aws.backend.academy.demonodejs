import { argv } from 'node:process';
import path from 'node:path';

// Get arguments from the command line
const args = argv.slice(2);

// Find argument that starts with --run=, --func=,--promise=, and --args=
const argRun = args.find((arg) => arg.startsWith('--run='));
const argFunc = args.find((arg) => arg.startsWith('--func='));
const argDisplay = args.find((arg) => arg.startsWith('--display='));
const argParam = args.find((arg) => arg.startsWith('--args='));
const argPromise = args.find((arg) => arg.startsWith('--promise='));

if (argRun && argFunc) {
  // Extract the path value from the --run argument
  const runValue = argRun.split('=')[1];
  // Convert the path from 'dir:moduleFile' format to the system's path format
  const modulePath = path.join(...runValue.split(':'));

  // Extract the function name from the --func argument
  const funcValue = argFunc.split('=')[1];

  // Extract display argument and convert it to boolean
  const displayValue = argDisplay ? argDisplay.split('=')[1] === 'true' : false;

  // Extract promise argument and convert it to boolean
  const promiseValue = argPromise ? argPromise.split('=')[1] === 'true' : false;

  // Extract the parameters from --param if provided, otherwise use an empty array
  const params = argParam ? argParam.split('=')[1].split(',') : [];

  // Dynamically import the module using the resolved module path
  import(path.resolve(import.meta.dirname, `${modulePath}.js`))
    .then(async (module) => {
      // Check if the function exists in the imported module and is callable
      if (typeof module[funcValue] === 'function') {
        try {
          // Call the function with the parameters provided
          const result = promiseValue
            ? await module[funcValue](...params)
            : module[funcValue](...params);
          // If display is true, print the result to the console
          if (displayValue) {
            console.log(result);
          }
        } catch (error) {
          console.error(`Error from Call Function : ${error.message}`);
        }
      } else {
        console.error(
          `Function "${funcValue}" not found in module "${modulePath}"`
        );
      }
    })
    .catch((error) => {
      // Handle errors that occur during module import
      console.error(`Failed to load module: ${error.message}`);
    });
} else {
  // Error message if either --run or --func argument is missing
  console.error('Missing --run or --func argument.');
}
