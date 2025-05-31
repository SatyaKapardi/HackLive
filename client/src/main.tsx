import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Update theme.json colors to match design
document.documentElement.style.setProperty('--primary', 'hsl(217, 91%, 60%)');
document.documentElement.style.setProperty('--secondary', 'hsl(24, 94%, 53%)');
document.documentElement.style.setProperty('--background', 'hsl(210, 20%, 98%)');
document.documentElement.style.setProperty('--foreground', 'hsl(222, 47%, 11%)');

createRoot(document.getElementById("root")!).render(<App />);
