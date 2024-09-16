export async function fetchDreamAnalysis(dreamDescription) {
    const maxRetries = 5; // Maximum number of retries
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/openai-dream-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dreamDescription }),
            });

            if (!response.ok) {
                if (response.status === 429) { // Rate limit error
                    const retryAfter = response.headers.get('retry-after') || 20; // Default to 20 seconds
                    console.warn(`Rate limit reached. Retrying after ${retryAfter} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                    attempt++;
                    continue; // Retry the request
                }
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data.analysis;
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch AI dream analysis: ${error.message}`);
        }
    }

    throw new Error('Max retries reached. Unable to fetch AI dream analysis.');
}
