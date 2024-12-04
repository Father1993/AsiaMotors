const VideoBlock = () => {
    return (
        <section className="mb-16" id="video__test">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Своя команда и офисы в Китае. Гарантия качества!
            </h2>
            <div className="max-w-4xl mx-auto">
                <video
                    className="w-full aspect-video"
                    controls
                    playsInline
                    poster="/video/tank300.jpg"
                >
                    <source src="/video/tank300.mp4" type="video/mp4" />
                </video>
            </div>
        </section>
    )
}

export default VideoBlock
