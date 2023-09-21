import { Container } from "@mui/material";
import MainContent from "./components/MainContent";
import "./App.css";

const App = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100vw",
        marginTop: "30px",
      }}
    >
      <Container maxWidth="xl">
        <MainContent />
      </Container>
    </div>
  );
};

export default App;
