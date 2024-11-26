'use client'

import { motion } from 'framer-motion'
import TestimonialsBlock from './TestimonialsBlock'
import Questions from './Questions'
import Social from './Social'
import VideoBlock from './VideoBlock'
import SuccessCase from './SuccessCase'
import ContactsBlock from './ContactsBlock'
import Statistics from './Statistics'
import Team from './Team'
import HeroBlock from './HeroBlock'
import AdvantagesBlock from './AdvantagesBlock'
import Breadcrumbs from '@/components/features/Breadcrumbs/Breadcrumbs'
import { ABOUT_BREADCRUMBS } from '@/shared/constants/breadcrumbs'
import FAQAbout from '@/components/features/Faq/FAQAbout'
import CompanyCard from '@/components/common/CompanyCard/CompanyCard'

const AboutPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-b from-white to-gray-50"
        >
            <div className="container mx-auto px-4 py-16">
                <Breadcrumbs items={ABOUT_BREADCRUMBS} />
                <HeroBlock />
                <Statistics />
                <Team />
                <CompanyCard />
                <AdvantagesBlock />
            </div>
            <VideoBlock />
            <SuccessCase />
            <TestimonialsBlock />
            <Social />
            <FAQAbout />
            <Questions />
            <ContactsBlock />
        </motion.div>
    )
}

export default AboutPage
