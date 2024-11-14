import { motion } from 'framer-motion'

const VideoBlock = () => {
    return (
        // Новая секция с видео о компании
        <section className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
                Своя команда и офисы в Китае. Гарантия качества!
            </h2>
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl overflow-hidden shadow-2xl"
                >
                    <video
                        controls
                        className="w-full"
                        poster="/video/preview-thumbnail.jpg"
                    >
                        <source src="/video/tank.mp4" type="video/mp4" />
                        Ваш браузер не поддерживает видео
                    </video>
                </motion.div>
            </div>
        </section>
    )
}

export default VideoBlock
