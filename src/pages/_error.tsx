import Link from "next/link";

type PageNotFoundProps = {};

const PageNotFound: React.FC<PageNotFoundProps> = () => {
    return (
        <h1>Opps. Page not found! <Link href="/" className="tw-text-blue-500">Go home</Link></h1>

    );
};

export default PageNotFound;