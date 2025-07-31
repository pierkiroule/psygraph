// src/components/PsyCarousel.jsx
import Slider from "react-slick";
import { Button } from "@mui/material";
import { exportPsychographiesPDF } from "../lib/pdfExporter";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function PsyCarousel({ psychographies }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Psychographies</h2>
      <Slider {...settings}>
        {psychographies.map((p, idx) => (
          <div key={idx} style={{ textAlign: "center", padding: "10px" }}>
            <h3>{p.titre}</h3>
            <p style={{ fontStyle: "italic", color: "gray" }}>
              {p.pseudo || "Anonyme"} • {new Date(p.created_at).toLocaleDateString("fr-FR")}
            </p>
            {p.tags?.length > 0 && (
              <p style={{ color: "#2980B9" }}>{p.tags.map((t) => `#${t}`).join(" ")}</p>
            )}
            <p style={{ textAlign: "justify" }}>{p.texte}</p>
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.titre}
                style={{ maxWidth: "80%", marginTop: "10px" }}
              />
            )}
          </div>
        ))}
      </Slider>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportPsychographiesPDF(psychographies)}
        >
          Exporter en PDF
        </Button>
      </div>
    </div>
  );
}