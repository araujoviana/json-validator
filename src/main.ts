// Import the mount function from the Svelte library to render the application
// Import CSS stylesheet for the application
// Import the root App component from App.svelte
import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

// Mount the App component to the DOM element with the id 'app'
const app = mount(App, {
  // Specify the target element for the application
  target: document.getElementById('app')!,
})

// Export the mounted application instance as the default export
export default app
