// Export the function so it can be used in other modules/files
export function formatDuration(duration) {
    // Calculate the number of minutes by dividing by 60 and rounding down
    const minutes = Math.floor(duration / 60);
    // Calculate the remaining seconds using modulus operator and rounding down
    const seconds = Math.floor(duration % 60);
    // Return the formatted string "MM:SS"
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  