import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Container, Button} from "react-bootstrap";
import {useAuth} from "../hooks";

const HeaderNavbar = () => {
    const auth = useAuth();
    const onLogOut = (e) => {
        e.preventDefault();
        auth.logOut();
    }
    return (
        <Navbar  bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">Simple Chat Example</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!auth.loggedIn?<Nav.Link href="/login">Войти</Nav.Link>:null}
                        {!auth.loggedIn?<Nav.Link href="/signup">Регистрация</Nav.Link>:null}
                        {auth.loggedIn?<Nav.Link onClick={(e)=>onLogOut(e)}>Выйти</Nav.Link>:null}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default HeaderNavbar;