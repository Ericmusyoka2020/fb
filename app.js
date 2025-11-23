const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "No URL provided" });

    try {
        const info = await ytdlp(videoUrl, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
            referer: videoUrl,
        });

        const result = {
            title: info.title,
            uploader: info.uploader || "Unknown",
            duration: info.duration || 0,
            formats: (info.formats || []).filter(f => f.url).map(f => ({
                format: f.format_id,
                ext: f.ext,
                url: f.url
            }))
        };

        res.json(result);
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ error: "Failed to fetch video info" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
