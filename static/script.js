
document.addEventListener('DOMContentLoaded', () => {
  console.log('script loaded');
  const messages = document.getElementById('messages');
  const input = document.getElementById('msg');
  const sendBtn = document.getElementById('sendBtn');
  const imageInput = document.getElementById('imageInput');
  const voiceBtn = document.getElementById('voiceBtn');

  // Voice recognition variables
  let recognition = null;
  let isListening = false;

  // Initialize voice recognition if available (with broader browser support)
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window || 'mozSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    // Firefox-specific settings
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      recognition.continuous = true;
      recognition.interimResults = true;
    }

    recognition.onresult = (event) => {
      // Handle both final and interim results for broader browser support
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      
      // Fallback to first result if no final result yet
      if (!transcript && event.results.length > 0) {
        transcript = event.results[0][0].transcript;
      }
      
      if (transcript) {
        input.value = transcript;
        updateVoiceButton(false);
        addMessage('bot', `✓ I heard: "${transcript}"`);
        // Auto-send after voice input
        setTimeout(() => {
          if (input.value.trim()) {
            sendMessage();
          }
        }, 500);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      updateVoiceButton(false);
      let errorMsg = 'Voice recognition error';
      switch(event.error) {
        case 'no-speech':
          errorMsg = '🔇 No speech detected. Please try again.';
          break;
        case 'audio-capture':
          errorMsg = '🎤 Microphone not found or permission denied.';
          break;
        case 'not-allowed':
          errorMsg = '🚫 Microphone permission denied. Please allow microphone access in browser settings.';
          break;
        case 'network':
          errorMsg = '🌐 Network error. Check your internet connection.';
          break;
        default:
          errorMsg = `⚠️ Voice error: ${event.error}`;
      }
      addMessage('bot', errorMsg);
    };

    recognition.onend = () => {
      updateVoiceButton(false);
    };
  } else {
    console.warn('Speech recognition not supported in this browser');
    if (voiceBtn) {
      voiceBtn.disabled = true;
      voiceBtn.title = 'Voice input not supported in this browser. Try Chrome, Edge, Safari, or Firefox.';
      voiceBtn.style.opacity = '0.5';
      voiceBtn.style.cursor = 'not-allowed';
    }
  }

  function updateVoiceButton(listening) {
    isListening = listening;
    if (voiceBtn) {
      voiceBtn.innerHTML = listening ? '🔴 Listening...' : '🎤';
      voiceBtn.style.background = listening ? 'linear-gradient(135deg, #dc2626, #ef4444)' : '';
      voiceBtn.style.animation = listening ? 'pulse 1s infinite' : '';
    }
  }

  function toggleVoiceInput() {
    if (!recognition) {
      addMessage('bot', '⚠️ Voice input is not supported in your browser. Please use Chrome, Edge, Safari, or Firefox (v69+).');
      return;
    }

    if (isListening) {
      recognition.stop();
      updateVoiceButton(false);
    } else {
      try {
        recognition.start();
        updateVoiceButton(true);
        
        // Show browser-specific guidance
        const browser = navigator.userAgent.toLowerCase();
        let guidance = '🎤 Listening... Speak now!';
        if (browser.includes('firefox')) {
          guidance += ' (Firefox: Speak clearly and wait 3 seconds after finishing)';
        }
        addMessage('bot', guidance);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        
        // Handle browser-specific errors
        if (error.name === 'InvalidStateError') {
          addMessage('bot', '⚠️ Voice recognition is already active. Please wait...');
        } else {
          addMessage('bot', `Voice recognition error: ${error.message}`);
        }
        updateVoiceButton(false);
      }
    }
  }

  function addMessage(who, text, imageData = null) {
    const el = document.createElement('div');
    el.className = 'message ' + who;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // Add image if provided
    if (imageData) {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'image-container';

      const img = document.createElement('img');
      img.src = imageData;
      img.alt = 'Uploaded image';
      img.className = 'chat-image';

      imgContainer.appendChild(img);
      bubble.appendChild(imgContainer);

      // Add some space between image and text
      if (text) {
        const textSpacer = document.createElement('div');
        textSpacer.style.marginTop = '10px';
        bubble.appendChild(textSpacer);
      }
    }

    // Add text if provided
    if (text) {
      const textElement = document.createElement('div');
      textElement.className = 'message-text';

      // Convert markdown-style formatting to HTML
      const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

      textElement.innerHTML = formattedText;
      bubble.appendChild(textElement);
    }

    el.appendChild(bubble);
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function handleImageUpload(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select an image file'));
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Image size should be less than 5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      reader.readAsDataURL(file);
    });
  }

  async function analyzeImage(imageFile, textMessage = '') {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      if (textMessage) {
        formData.append('message', textMessage);
      }

      console.log('Sending image analysis request...');

      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      });

      const responseText = await res.text();

      // Check if we got HTML (login page)
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.includes('<html>') || responseText.includes('login')) {
        throw new Error('Authentication required. Please log in to use image analysis.');
      }

      if (!res.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          throw new Error(errorData.error || `Server error: ${res.status}`);
        } catch (e) {
          throw new Error(`Server error: ${res.status}. Please try again.`);
        }
      }

      // Parse successful JSON response
      const data = JSON.parse(responseText);
      return data;

    } catch (error) {
      console.error('Image analysis error:', error);
      throw error;
    }
  }

  async function sendMessage() {
    const msg = input.value.trim();
    const imageFile = imageInput?.files[0];

    if (!msg && !imageFile) return;

    sendBtn.disabled = true;

    try {
      // Handle image upload and analysis
      if (imageFile) {
        addMessage('system', 'Uploading and analyzing image...');

        // First, read the image for display
        const imageData = await handleImageUpload(imageFile);

        // Show user message with image
        const displayMessage = msg || `I uploaded this image for analysis`;
        addMessage('user', displayMessage, imageData);

        // Analyze the image
        try {
          const analysisResult = await analyzeImage(imageFile, msg);

          if (analysisResult.success) {
            addMessage('bot', analysisResult.response);
          } else {
            addMessage('bot', `Analysis completed with issues: ${analysisResult.error}`);
          }
        } catch (analysisError) {
          if (analysisError.message.includes('Authentication required') || analysisError.message.includes('login')) {
            addMessage('bot', '🔒 Please log in to use the image analysis feature. You can still chat without images.');
          } else {
            addMessage('bot', `Image analysis failed: ${analysisError.message}`);
          }
        }

        // Clear image input
        imageInput.value = '';
      }
      // Handle text message only
      else if (msg) {
        addMessage('user', msg);

        // Send to chat API
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({message: msg})
        });

        if (!res.ok) throw new Error('Network response not ok');
        const data = await res.json();
        addMessage('bot', data.response || 'No response');
      }

    } catch (err) {
      console.error('Send message error:', err);
      addMessage('bot', `Error: ${err.message}`);
    } finally {
      sendBtn.disabled = false;
      input.value = '';
      input.focus();
    }
  }

  // Event listeners
  const chatForm = document.getElementById('chatForm');
  
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage();
    });
  }
  
  sendBtn && sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sendMessage();
  });
  
  voiceBtn && voiceBtn.addEventListener('click', toggleVoiceInput);

  input && input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Image input change handler
  imageInput && imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        addMessage('system', 'Please select a valid image file (JPEG, PNG, GIF, WebP)');
        imageInput.value = '';
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        addMessage('system', 'Image size must be less than 5MB');
        imageInput.value = '';
        return;
      }

      console.log('Image selected:', file.name, file.type, file.size);

      // Auto-send the image
      sendMessage();
    }
  });
});