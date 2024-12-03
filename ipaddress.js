const axios = require('axios');

const fetchAndSubmitIP = async () => {
    try {
        // Fetch the passage from the given link
        const response = await axios.get('https://quest.squadcast.tech/api/1NT21EC117/worded_ip');
        const passage = response.data;

        // Map words to digits
        const wordToDigit = {
            "zero": "0",
            "one": "1",
            "two": "2",
            "three": "3",
            "four": "4",
            "five": "5",
            "six": "6",
            "seven": "7",
            "eight": "8",
            "nine": "9",
            "point": "."
        };

        // Parse the passage to find the IP in words
        const words = passage.split(/\s+/); // Split on whitespace
        const ipCandidates = [];
        let currentCandidate = [];

        for (const word of words) {
            if (wordToDigit[word] !== undefined) {
                const translated = wordToDigit[word];
                currentCandidate.push(translated);
            } else if (currentCandidate.length > 0) {
                // If we encounter a non-IP word, finalize the current candidate
                ipCandidates.push(currentCandidate.join(''));
                currentCandidate = [];
            }
        }
        // Push the last candidate if still valid
        if (currentCandidate.length > 0) {
            ipCandidates.push(currentCandidate.join(''));
        }

        // Validate each candidate to extract a valid IP address
        const validIp = ipCandidates.find(candidate => {
            const parts = candidate.split('.');
            return (
                parts.length === 4 &&
                parts.every(part => part.match(/^\d+$/) && Number(part) >= 0 && Number(part) <= 255)
            );
        });

        if (!validIp) {
            throw new Error("No valid IP address found!");
        }

        console.log(`Parsed IP Address: ${validIp}`);

        // Actual code that calculates the answer
        const codeBody = `
const wordToDigit = {
    "zero": "0",
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
    "point": "."
};
const passage = \`${passage}\`;
const words = passage.split(/\\s+/);
const ipCandidates = [];
let currentCandidate = [];

for (const word of words) {
    if (wordToDigit[word] !== undefined) {
        const translated = wordToDigit[word];
        currentCandidate.push(translated);
    } else if (currentCandidate.length > 0) {
        ipCandidates.push(currentCandidate.join(''));
        currentCandidate = [];
    }
}
if (currentCandidate.length > 0) {
    ipCandidates.push(currentCandidate.join(''));
}

const validIp = ipCandidates.find(candidate => {
    const parts = candidate.split('.');
    return (
        parts.length === 4 &&
        parts.every(part => part.match(/^\\d+$/) && Number(part) >= 0 && Number(part) <= 255)
    );
});
if (!validIp) {
    throw new Error('No valid IP address found!');
}
return validIp;
`;

        // Submit the result via POST request
        const submissionURL = `https://quest.squadcast.tech/api/1NT21EC117/submit/worded_ip?answer=${validIp}&extension=js`;
        const result = await axios.post(submissionURL, codeBody, {
            headers: { 'Content-Type': 'text/plain' }
        });

        console.log("Submission Response:", result.data);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

fetchAndSubmitIP();
