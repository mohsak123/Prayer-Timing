import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const Prayer = ({ name, time, image }) => {
  return (
    <Card sx={{ width: "100%", marginTop: "20px" }} className="card-prayer">
      <CardMedia sx={{ height: 140 }} image={image} title="green iguana" />
      <CardContent>
        <h2>{name}</h2>
        <Typography className="time-prayer" variant="h1" color="text.secondary">
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Prayer;
