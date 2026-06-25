// Importing the necessary hook from react
import { useState } from 'react';

// Input component
const Input = ({handleSend,inputMessage,setInputMessage,isLoading}) => (
  
  <form onSubmit={handleSend} className="input-form">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="e.g., Apple, Meta, Vercel..."
              className="input-box"
              disabled={isLoading}
              autoFocus
            />
            <button className="button" disabled={isLoading}>
              {isLoading ? 'Deploying...' : 'Activate Agent'}
            </button>
          </form>
          
)

// Main function App
function App() {

  // Initializing state variables
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mailContent, setMailContent] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [loadingMessage,setLoadingMessage] = useState("Initiating Agent....")

  // function to handle the input 
  const handleSend = async (e) => {

    // Prevents the browser from refreshing on the subimission of form
    e.preventDefault();

    // Saves the inputted message in userMessage
    const userMessage = inputMessage;
    
    // Safety
    if (!inputMessage.trim()) return;

    // Updating state variables
    setInputMessage('');
    setPainPoints('');
    setMailContent('');
    setShowOutput(false);
    setIsLoading(true);

    // Exception handling
    try {
      // Sending the fetch request 
      const response = await fetch("https://lga-backend.onrender.com", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: userMessage })
      });
      
      // Streaming the events live on UI
      const reader = response.body.getReader()
      const decoder = new TextDecoder("utf-8")

      let buffer=""

      // while loop runs as long as the data keeps ariving
      while(true){

        const {done, value} = await reader.read()
        if(done) break
        
        // Decodes the binary data and adds it to buffer
        buffer += decoder.decode(value,{stream:true})
        const lines = buffer.split('\n')

        // Removes the last Line of the data and saves it to buffer to prevent rendering of half-cutted lines
        buffer = lines.pop()

        for(const line of lines){

          // Check if the data is empty
          if(line.trim()){

            // Convert the json string to python object
            const data = JSON.parse(line)

            // Error handling
            if (data.status === "error") {
              console.error(data.message);
              setLoadingMessage("Error occurred. Check console.");
            }
            
            // This is the last event so render the required content
            else if(data.status==="complete"){
              setIsLoading(false)
              setLoadingMessage("Initiating Agent....")
              setShowOutput(true)
              setPainPoints(data.pain_points)
              setMailContent(data.mail)
              
            }

            // Render the latest update of Agent to the UI
            else{
              setLoadingMessage(data.message)
            }

          }
        }

      }

    } catch (error) {
      console.error("AI processing error:", error);
    } 
  };

  // UI render
  return (
    <div className='parent-container'>
      <div className="app-wrapper">
        <header className='header-container'>
          <h1>Autonomous Lead Generation</h1>
          <p className="subtitle">
            Draft a hyper-personalized B2B cold email in under 10 seconds.
          </p>
        </header>

        <main className='body-container'>
          <Input handleSend={handleSend} inputMessage={inputMessage} setInputMessage={setInputMessage} isLoading={isLoading} />

          {isLoading && (
            <div className="loading-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
                <path d="M12 2v4" />
                <path d="m16.2 7.8 2.9-2.9" />
                <path d="M18 12h4" />
                <path d="m16.2 16.2 2.9 2.9" />
                <path d="M12 18v4" />
                <path d="m4.9 19.1 2.9-2.9" />
                <path d="M2 12h4" />
                <path d="m4.9 4.9 2.9 2.9" />
              </svg>
              <span>{loadingMessage}</span>
            </div>

          )}

          {showOutput && !isLoading && (
            <div className='response-container fade-in'>
              <div className="output-card">
                <h4>Identified Corporate Pain Points</h4>
                <p className='pain-points'>{painPoints}</p>
              </div>

              <div className="output-card">
                <h4>Drafted Outreach Email</h4>
                <textarea
                  readOnly={true}
                  className="email-textarea"
                  value={mailContent}
                  onClick={(e) => e.target.select()}
                />
                <small className='hint'>Click inside the box to select all text</small>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;