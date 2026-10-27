import PagesLayout from '@/components/layout/PageLayout'
import { LoadingProvider } from '@/components/provider/CustomProviderSpinner'
import ModalProvider from '@/components/provider/ModalProvider'
import PWAPrompt from '@/components/common/PWAPrompt/PWAPrompt'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <PagesLayout>
            <LoadingProvider>
                <ModalProvider>{children}<PWAPrompt /></ModalProvider>
            </LoadingProvider>
        </PagesLayout>
    )
}
