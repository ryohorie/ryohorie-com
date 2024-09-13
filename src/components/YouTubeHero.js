import React from "react"
import { Box } from "@mui/material"

const YouTubeHero = ({ videoId }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "56.25vw",
        maxHeight: "70vh",
        position: "relative",
      }}
    >
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&loop=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: "absolute", top: 0, left: 0 }}
      ></iframe>
    </Box>
  )
}

export default YouTubeHero
