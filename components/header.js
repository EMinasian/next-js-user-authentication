import { logout } from "@/actions/auth-action"

export default function Header() {

    return (
        <header>
            <form className="header-component" action={logout}>
                <button className="log-out-button">Log out</button>
            </form>
        </header>
    )
}