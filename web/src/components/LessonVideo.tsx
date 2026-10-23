// works out what kind of video it's been given rather than being told: starts with "/" or ends ".mp4"
// means a local file, anything else is treated as a youtube id
// no video at all gets a short note, not an empty 16:9 hole -- an empty box looks broken, a sentence doesn't
export function LessonVideo({ video, title }: { video?: string; title: string }) {
  if (!video) {
    return (
      <div className="video-slot empty">
        <strong>Video coming soon</strong>
        <span>The written lesson below covers everything the video will.</span>
      </div>
    );
  }
  if (video.startsWith("/") || video.endsWith(".mp4")) {
    return (
      <div className="video-slot">
        <video controls preload="metadata" src={video} title={title} />
      </div>
    );
  }
  return (
    <div className="video-slot">
      <iframe
        // nocookie domain and rel=0, so youtube sets nothing until play and suggests nothing afterwards
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video)}?rel=0`}
        title={title}
        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
