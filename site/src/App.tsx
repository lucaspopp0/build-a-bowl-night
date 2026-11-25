// MUI baseline styles and the app's navbar and page.
import CssBaseline from "@mui/material/CssBaseline";
import NavBar from "./components/NavBar";
import IngredientsPage from "./pages/IngredientsPage";

// Root component: navbar on top, with the single page below it.
export default function App() {
  // CssBaseline normalizes browser styles before rendering the layout.
  return (
    <>
      <CssBaseline />
      <NavBar />
      <IngredientsPage />
    </>
  );
}
