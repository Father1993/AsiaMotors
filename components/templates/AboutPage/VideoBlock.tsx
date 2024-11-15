import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import videojs from 'video.js'
import type Player from 'video.js/dist/types/player'
import 'video.js/dist/video-js.css'

const VideoBlock = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const playerRef = useRef<Player | null>(null)

    useEffect(() => {
        // Если плеер уже существует, не создаем новый
        if (!playerRef.current && videoRef.current) {
            const player = videojs(videoRef.current, {
                fluid: true,
                controls: true,
                preload: 'metadata',
                responsive: true,
                playbackRates: [0.5, 1, 1.5, 2],
                controlBar: {
                    children: [
                        'playToggle',
                        'volumePanel',
                        'progressControl',
                        'currentTimeDisplay',
                        'timeDivider',
                        'durationDisplay',
                        'playbackRateMenuButton',
                        'fullscreenToggle',
                    ],
                },
            })

            playerRef.current = player
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.dispose()
                playerRef.current = null
            }
        }
    }, [])

    return (
        <section className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Своя команда и офисы в Китае. Гарантия качества!
            </h2>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl overflow-hidden shadow-2xl"
                >
                    <video
                        ref={videoRef}
                        className="video-js vjs-big-play-centered"
                        poster="/video/tank300.jpg"
                        playsInline
                    >
                        <source src="/video/tank300.mp4" type="video/mp4" />
                    </video>
                </motion.div>
            </div>
        </section>
    )
}

export default VideoBlock
