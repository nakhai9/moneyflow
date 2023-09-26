type AuthLayoutProps = {
    children: React.ReactNode
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return <>
        <div className="vdt-h-screen vdt-w-full vdt-bg-zinc-100">
            <div className="vdt-absolute vdt-flex vdt-top-1/2 vdt-left-1/2 -vdt-translate-y-1/2 -vdt-translate-x-1/2 vdt-w-80 vdt-bg-white vdt-p-5 vdt-rounded">
                {children}
            </div>
        </div>
    </>
}

export default AuthLayout;