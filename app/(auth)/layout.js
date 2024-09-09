import Header from "@/components/header";

export default function AuthLayout({ children }) {
    return (
        <>  
            <Header />
            {children}

        </>
    );
  }