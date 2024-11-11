import Header from '../sections/Header/Header'
import Footer from '../sections/Footer/Footer'

const Layout = ({ children }: { children: React.ReactNode }) => (
    <>
        <Header />
        {children}
        <Footer />
    </>
)

export default Layout
