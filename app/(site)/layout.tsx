import PagesLayout from '@/components/layout/PageLayout'
import { LoadingProvider } from '@/components/provider/CustomProviderSpinner'
import ModalProvider from '@/components/provider/ModalProvider'
import PwaExperience from '@/components/pwa/PwaExperience'
export const metadata = {
    manifest: '/manifest.webmanifest',
    appleWebApp: {
        capable: true,
        title: 'AsiaMotors',
        statusBarStyle: 'default' as const,
    },
}

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <PagesLayout>
            <LoadingProvider>
                <ModalProvider>
                    {children}
                    <PwaExperience />
                </ModalProvider>
            </LoadingProvider>
        </PagesLayout>
    )
}
