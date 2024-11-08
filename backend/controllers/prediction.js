const path = require('path');
const { spawn } = require('child_process'); // Used to run the Python script

// Controller to get predictions
exports.getPredictions = (req, res) => {
  const { year } = req.body; // Get the year from the request body

  // Ensure the year is a valid number
  if (!year || isNaN(year)) {
    return res.status(400).json({ message: 'Invalid year' });
  }

  // Construct the correct path to the Python script
  const pythonScriptPath = path.join(__dirname, '../python/expense_prediction.py');  // Update this path

  console.log('Running Python script:', pythonScriptPath);  // Log the path

  // Run the Python ML script with the year as an argument
  const pythonProcess = spawn('python', [
    pythonScriptPath, // Path to your Python script
    year.toString(),  // Pass the year as an argument to the Python script
  ]);

  let result = '';

  // Capture the output of the Python script
  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  // Handle errors
  pythonProcess.stderr.on('data', (data) => {
    console.error('Error:', data.toString());
  });

  // Send the response once the process finishes
  pythonProcess.on('close', (code) => {
    console.log('Python script finished with code:', code); // Log when the script finishes
    if (code === 0) {
      try {
        // Parse the result as JSON and send it back to the frontend
        const predictions = JSON.parse(result);
        console.log('Predictions:', predictions); // Log the predictions
        res.json(predictions);
      } catch (error) {
        res.status(500).json({ message: 'Error processing predictions' });
      }
    } else {
      res.status(500).json({ message: 'Python script execution failed' });
    }
  });
};
