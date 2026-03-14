export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    switch (error.message) {
      case 'RATE_LIMIT':
        return "We're getting a lot of requests right now. Please try again in a few minutes.";
      case 'NO_RESULTS':
        return "We couldn't identify this plant. Try getting closer or ensuring good lighting.";
      case 'LOW_CONFIDENCE':
        return "We couldn't confidently identify this plant. Try a different angle or select the correct plant part (leaf, flower, fruit, or bark).";
      default:
        if (error.message.startsWith('API_ERROR_')) {
          return 'Something went wrong on our end. Please try again.';
        }
        if (error.message.includes('Network') || error.message.includes('fetch')) {
          return 'No internet connection. Please check your network and try again.';
        }
    }
  }
  return 'Something went wrong. Please try again.';
}
