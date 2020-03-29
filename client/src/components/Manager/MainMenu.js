import React from 'react';
import styled from 'styled-components';
import Window from './Window';
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

const DEFAULT_CONFIG = {
  request: ['keyboard', 'logout', 'worldCreator']
};

class MainMenu extends Window {
  constructor() {
    super();
    this.configurate(DEFAULT_CONFIG);

    this.Component = ({ set }) => (
      <Wrapper ref={ set('main') }>
        <MenuButton ref={ set('play') }>
          Play
        </MenuButton>
        <MenuButton ref={ set('settings') }>
          Settings
        </MenuButton>
        <MenuButton ref={ set('account') }>
          Account
        </MenuButton>
        <MenuButton ref={ set('logout') }>
          Logout
        </MenuButton>
      </Wrapper>
    );
  }

  onSupply() {
    this.ref.get('logout')
      .on('click', () => {
        this.logout();
      });
    
    this.ref.get('play')
      .on('click', () => {
        this.hide();
        this.worldCreator.show();
      })
  }

  onOpen() {
    this.keyboard.lock(this.constructor.name);
  }

  onClose() {
    this.keyboard.unlock(this.constructor.name);
  }
}
  
export default MainMenu;