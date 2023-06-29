import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks';

const HeaderNavbar = () => {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const onLogOut = (e) => {
    e.preventDefault();
    auth.logOut();
  };
  console.log('i18n.getResource', i18n.getResourceBundle('ru', 'translation'));
  return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">{ t('headerNavBar.header') }</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!auth.loggedIn ? <Nav.Link href="/login">{t('headerNavBar.login')}</Nav.Link> : null}
                        {!auth.loggedIn ? <Nav.Link href="/signup">{t('headerNavBar.register')}</Nav.Link> : null}
                        {auth.loggedIn ? <Nav.Link onClick={(e) => onLogOut(e)}>{t('headerNavBar.logout')}</Nav.Link> : null}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  );
};
export default HeaderNavbar;
