import React from 'react'
import { useEffect } from 'react';

export default function AIagent() {

 useEffect(() => {
  // Create a script element
  const script = document.createElement('script');
  script.src = 'https://cdn.jotfor.ms/agent/embedjs/0196cbcaa1867d7cbab9458e546c0d56e7f5/embed.js?skipWelcome=1&maximizable=1';
  script.async = true;

  // Append the script to the body
  document.body.appendChild(script);

  // Cleanup the script when the component is unmounted
  return () => {
   document.body.removeChild(script);
  };
 }, []);

 return (
  <div>
   {/* Add a container for the chatbot if needed */}
   <div id="ai-chatbot-container"></div>
  </div>
 );

 return (
  <div>
   {/* Add a container for the chatbot if needed */}
   <div id="ai-chatbot-container"></div>
  </div>
 )
}

{/* <script
  src='https://cdn.jotfor.ms/agent/embedjs/0196cbcaa1867d7cbab9458e546c0d56e7f5/embed.js?skipWelcome=1&maximizable=1'>
</script> */}