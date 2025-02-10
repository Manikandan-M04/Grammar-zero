// const startBtn = document.getElementById('start-btn');
// const stopBtn = document.getElementById('stop-btn');
// const result = document.getElementById('result');
// const textInput = document.getElementById('text-input');
// const checkTextBtn = document.getElementById('check-text-btn');
// const highlightedResult = document.getElementById('highlighted-result');
// const grammarResult = document.getElementById('grammar-result');

// let recognition;

// if ('webkitSpeechRecognition' in window) {
//     recognition = new webkitSpeechRecognition();
// } else if ('SpeechRecognition' in window) {
//     recognition = new SpeechRecognition();
// } else {
//     alert('Your browser does not support speech recognition.');
// }

// if (recognition) {
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     recognition.onstart = () => {
//         startBtn.disabled = true;
//         stopBtn.disabled = false;
//     };

//     recognition.onresult = (event) => {
//         let interimTranscript = '';
//         let finalTranscript = '';

//         for (let i = event.resultIndex; i < event.results.length; i++) {
//             const transcript = event.results[i][0].transcript;
//             if (event.results[i].isFinal) {
//                 finalTranscript += transcript;
//             } else {
//                 interimTranscript += transcript;
//             }
//         }
//         result.innerHTML = finalTranscript + '<i style="color: #999;">' + interimTranscript + '</i>';
//         checkGrammar(finalTranscript);
//     };

//     recognition.onerror = (event) => {
//         console.error(event.error);
//     };

//     recognition.onend = () => {
//         if (startBtn.disabled) {
//             recognition.start();
//         } else {
//             startBtn.disabled = false;
//             stopBtn.disabled = true;
//         }
//     };

//     startBtn.addEventListener('click', () => {
//         recognition.start();
//     });

//     stopBtn.addEventListener('click', () => {
//         recognition.stop();
//         startBtn.disabled = false;
//         stopBtn.disabled = true;
//     });

//     checkTextBtn.addEventListener('click', () => {
//         const text = textInput.value;
//         checkGrammar(text);
//     });
// }

// async function checkGrammar(text) {
//     try {
//         const response = await fetch('https://api.languagetool.org/v2/check', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: `text=${encodeURIComponent(text)}&language=en-US`
//         });
//         const result = await response.json();
//         displayGrammarResult(result, text);
//     } catch (error) {
//         console.error('Error checking grammar:', error);
//     }
// }

// function displayGrammarResult(result, text) {
//     grammarResult.innerHTML = '';
//     if (result.matches.length === 0) {
//         grammarResult.innerHTML = 'No grammar errors found!';
//     } else {
//         let highlightedText = text;
//         result.matches.forEach(match => {
//             const error = document.createElement('p');
//             error.innerHTML = `Error: ${match.message}<br>Suggestion: ${match.replacements.map(r => r.value).join(', ')}`;
//             grammarResult.appendChild(error);

//             const errorText = text.substring(match.offset, match.offset + match.length);
//             const replacementText = match.replacements.length > 0 ? match.replacements[0].value : '';
//             const highlightedErrorText = `<span class="highlight">${errorText}</span><span class="replacement"> (${replacementText})</span>`;
//             highlightedText = highlightedText.replace(errorText, highlightedErrorText);
//         });
//         highlightedResult.innerHTML = highlightedText;
//     }
// }



const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const result = document.getElementById('result');
const textInput = document.getElementById('text-input');
const checkTextBtn = document.getElementById('check-text-btn');
const highlightedResult = document.getElementById('highlighted-result');
const grammarResult = document.getElementById('grammar-result');

let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert('Your browser does not support speech recognition.');
}

if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        startBtn.disabled = true;
        stopBtn.disabled = false;
    };

    recognition.onresult = (event) => {
        let finalTranscript = result.innerHTML;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            }
        }
        result.innerHTML = finalTranscript;
        checkGrammar(finalTranscript);
    };

    recognition.onerror = (event) => {
        console.error(event.error);
    };

    recognition.onend = () => {
        if (startBtn.disabled) {
            recognition.start();
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    };

    startBtn.addEventListener('click', () => {
        recognition.start();
    });

    stopBtn.addEventListener('click', () => {
        recognition.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });

    checkTextBtn.addEventListener('click', () => {
        const text = textInput.value;
        checkGrammar(text);
    });
}

async function checkGrammar(text) {
    try {
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `text=${encodeURIComponent(text)}&language=en-US`
        });
        const result = await response.json();
        displayGrammarResult(result, text);
    } catch (error) {
        console.error('Error checking grammar:', error);
    }
}

function displayGrammarResult(result, text) {
    grammarResult.innerHTML = '';
    if (result.matches.length === 0) {
        grammarResult.innerHTML = 'No grammar errors found!';
    } else {
        let highlightedText = text;
        result.matches.forEach(match => {
            const error = document.createElement('p');
            error.innerHTML = `Error: ${match.message}<br>Suggestion: ${match.replacements.map(r => r.value).join(', ')}`;
            grammarResult.appendChild(error);

            const errorText = text.substring(match.offset, match.offset + match.length);
            const replacementText = match.replacements.length > 0 ? match.replacements[0].value : '';
            const highlightedErrorText = `<span class="highlight">${errorText}</span><span class="replacement"> (${replacementText})</span>`;
            highlightedText = highlightedText.replace(errorText, highlightedErrorText);
        });
        highlightedResult.innerHTML = highlightedText;
    }
}