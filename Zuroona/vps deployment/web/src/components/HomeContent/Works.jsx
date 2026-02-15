"use client";

import { useTranslation } from "react-i18next";
import VideoWithDescription from "./VideoWithDescription";

export default function Works() {
    const { t } = useTranslation();

    // YouTube video ID from httpss://youtu.be/WNjUOq-MM0Y
    const YOUTUBE_VIDEO_ID = "WNjUOq-MM0Y";

    // Description text - will use translation from VideoWithDescription component
    // Pass null to use default translation, or pass custom text
    const description = null;

    return (
        <VideoWithDescription 
            videoId={YOUTUBE_VIDEO_ID}
            description={description}
        />
    );
}
