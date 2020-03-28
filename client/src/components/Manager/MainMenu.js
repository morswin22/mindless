import React from 'react';
import styled from 'styled-components';
import Window from './Window';
import IntegratedElement from 'components/Element/Element';
import Button from 'components/Element/Button';

const Wrapper = styled.div`
  display: grid!important;
  grid-auto-rows: 2fr 1fr 1fr 1fr;
  width: 350px;
  height: 450px;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  background: #333333;
  padding: 12.5px;
  align-items: center;
`;

const MenuButton = styled(Button)`
  position: initial;
  color: #fff;
  font-size: 1.8rem;

  &:nth-of-type(1) {
    font-size: 2.5rem;
    text-transform: uppercase;
  }
`;

export const MMWindow = React.forwardRef((props, ref) => (
  <Wrapper ref={el => ref.current.main = new IntegratedElement(el)}>
    <MenuButton ref={el => ref.current.play = new IntegratedElement(el, false)}>
      Play
    </MenuButton>
    <MenuButton ref={el => ref.current.settings = new IntegratedElement(el, false)}>
      Settings
    </MenuButton>
    <MenuButton ref={el => ref.current.account = new IntegratedElement(el, false)}>
      Account
    </MenuButton>
    <MenuButton ref={el => ref.current.logout = new IntegratedElement(el, false)}>
      Logout
    </MenuButton>
  </Wrapper>
));

const DEFAULT_CONFIG = {};

class MainMenu extends Window {
  constructor(p, ref, keyboard, logout) {
    super(p, ref);
    this.keyboard = keyboard;
    this.logout = logout;
    this.configurate(DEFAULT_CONFIG);

    this.ref.current.logout
      .on('click', () => {
        this.logout();
      })
  }

  onOpen() {
    this.keyboard.unlocked = false;
  }

  onClose() {
    this.keyboard.unlocked = true;
  }
}
  
export default MainMenu;