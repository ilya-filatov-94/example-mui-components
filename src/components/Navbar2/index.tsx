import { FC } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Бесконечная анимация полёта (один состав проходит весь путь)
const flyInfinitely = keyframes`
  0% { transform: translateX(-380px); }
  10% { transform: translateX(-60px); }
  85% { transform: translateX(calc(100% - 280px)); }
  100% { transform: translateX(calc(100% + 320px)); }
`;

// Покачивание
const gentleBob = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

// Вращение винта
const spinPropeller = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Стили навбара
const Nav = styled.nav`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.8rem 2rem;
  background: rgba(10, 25, 35, 0.88);
  backdrop-filter: blur(14px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 100;
  overflow: visible;
  font-family: 'Segoe UI', 'Roboto', system-ui, sans-serif;

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const Logo = styled.div`
  font-size: 1.7rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f9e0a0, #ffb347);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: 1px;
  cursor: default;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.02);
  }
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  @media (max-width: 768px) {
    gap: 1.2rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const LinkItem = styled.a`
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  color: #f0f3f8;
  padding: 0.4rem 0;
  position: relative;
  transition: color 0.2s;
  &:hover {
    color: #ffbc6e;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #ffbc6e;
    transition: width 0.25s;
  }
  &:hover::after {
    width: 100%;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const FlightZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;   /* важно: скрываем всё, что за пределами навбара, но скролла не будет */
  z-index: 5;
`;

// Контейнер для двух копий, которые будут двигаться
const Track = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// Одна летающая единица (баннер + трос + самолёт)
const FlyingUnit = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
  will-change: transform;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
`;

// Каждая копия будет иметь свою анимацию (сдвинуты по времени)
// Первая копия начинает с левого края
const FirstUnit = styled(FlyingUnit)`
  animation: ${css`${flyInfinitely} 10s linear infinite`};
`;

// Вторая копия начинается со смещением на половину пути (5s) или на -100% ширины трека?
// Чтобы второй начинал входить, когда первый уходит, нужно правильное смещение.
// Поскольку анимация длится 10 секунд, сделаем второй с задержкой -5s (т.е. он уже на полпути, когда первый стартует)
const SecondUnit = styled(FlyingUnit)`
  animation: ${css`${flyInfinitely} 10s linear infinite`};
  animation-delay: -5s;
`;

// Общая группа покачивания для всех элементов
const BobbingGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${css`
    ${gentleBob} 2.2s ease-in-out infinite
  `};
`;

const Banner = styled.div`
  background: linear-gradient(135deg, #b22234, #8b0000);
  padding: 6px 14px;
  border-radius: 40px 12px 40px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 200, 0.3);
  font-weight: 900;
  font-size: 1rem;
  letter-spacing: 1.5px;
  color: #ffecb3;
  text-transform: uppercase;
  white-space: nowrap;
  backdrop-filter: blur(2px);
  border-left: 3px solid #ffaa33;
  border-bottom: 2px solid #f0a020;
  font-family: 'Montserrat', 'Impact', sans-serif;

  &::before {
    content: "⚡";
    margin-right: 8px;
    font-size: 1rem;
    filter: drop-shadow(0 0 2px gold);
  }

  @media (max-width: 640px) {
    font-size: 0.7rem;
    padding: 4px 10px;
    &::before {
      margin-right: 5px;
    }
  }
`;

const TowCable = styled.div`
  width: 38px;
  height: 3px;
  background: repeating-linear-gradient(90deg, #b87c3a, #b87c3a 6px, #dba551 6px, #dba551 12px);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  position: relative;
  
  &::after {
    content: "⌇⌇";
    position: absolute;
    top: -12px;
    left: 8px;
    font-size: 14px;
    color: #c99440;
    letter-spacing: -3px;
    text-shadow: 0 1px 0 #fff8e0;
  }

  @media (max-width: 640px) {
    width: 24px;
    &::after {
      font-size: 10px;
      top: -9px;
      left: 4px;
    }
  }
`;

const PropellerGroup = styled.g`
  transform-origin: 172px 40px;
  animation: ${css`
    ${spinPropeller} 0.22s linear infinite
  `};
`;

const PlaneSVG = styled.svg`
  width: 200px;
  height: auto;
  display: block;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2));

  @media (max-width: 768px) {
    width: 160px;
  }
  @media (max-width: 480px) {
    width: 140px;
  }
`;

// Один состав (баннер+трос+самолёт)
const FlyingGroup = () => (
  <BobbingGroup>
    <Banner>Режим StandIn</Banner>
    <TowCable />
    <PlaneSVG viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bodyGreen" x1="0%" y1="0%" x2="100%" y2="40%">
          <stop offset="0%" stopColor="#1e6b2f" />
          <stop offset="60%" stopColor="#3ca04f" />
          <stop offset="100%" stopColor="#165b24" />
        </linearGradient>
        <filter id="shadow" x="-5%" y="-5%" width="120%" height="120%">
          <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter="url(#shadow)">
        <rect x="28" y="28" width="144" height="24" rx="10" fill="url(#bodyGreen)" stroke="#0e4219" strokeWidth="0.8" />

        <rect x="112" y="30" width="28" height="14" rx="4" fill="#c2ecff" stroke="#204c5e" strokeWidth="0.8" />
        <rect x="115" y="33" width="10" height="8" rx="1.5" fill="#e8f7ff" stroke="#204c5e" strokeWidth="0.5" />
        <rect x="127" y="33" width="10" height="8" rx="1.5" fill="#e8f7ff" stroke="#204c5e" strokeWidth="0.5" />

        <circle cx="58" cy="40" r="3.5" fill="#a1defa" stroke="#204c5e" strokeWidth="0.7" />
        <circle cx="76" cy="40" r="3.5" fill="#a1defa" stroke="#204c5e" strokeWidth="0.7" />
        <circle cx="94" cy="40" r="3.5" fill="#a1defa" stroke="#204c5e" strokeWidth="0.7" />

        <text x="82" y="48" fontFamily="'Segoe UI', 'Arial Black', sans-serif" fontSize="8" fontWeight="900" fill="#FFF2C9" stroke="#15471f" strokeWidth="0.4" textAnchor="middle" letterSpacing="1">КУКУРУЗНИК</text>

        <rect x="23" y="36" width="22" height="8" rx="2" fill="#bb882c" stroke="#6b4c1a" strokeWidth="0.6" />
        <polygon points="33,28 43,14 47,28" fill="#e6b642" stroke="#805d1f" strokeWidth="0.6" />

        <PropellerGroup>
          <circle cx="172" cy="40" r="6" fill="#5a3e1a" stroke="#32200b" strokeWidth="1.2" />
          <rect x="168" y="26" width="10" height="28" rx="3" fill="#b8860b" stroke="#7a4900" strokeWidth="0.8" />
          <rect x="158" y="36" width="28" height="8" rx="3" fill="#dba130" stroke="#7a4900" strokeWidth="0.6" />
        </PropellerGroup>

        <line x1="38" y1="44" x2="158" y2="44" stroke="#FFF3BB" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.8" />

        <rect x="68" y="52" width="16" height="5" rx="2" fill="#4e3a22" />
        <rect x="118" y="52" width="16" height="5" rx="2" fill="#4e3a22" />
        <circle cx="76" cy="59" r="4.5" fill="#2b2b27" stroke="#767464" strokeWidth="0.8" />
        <circle cx="126" cy="59" r="4.5" fill="#2b2b27" stroke="#767464" strokeWidth="0.8" />
        <line x1="76" y1="52" x2="76" y2="59" stroke="#7a6233" strokeWidth="1.5" />
        <line x1="126" y1="52" x2="126" y2="59" stroke="#7a6233" strokeWidth="1.5" />
      </g>
    </PlaneSVG>
  </BobbingGroup>
);

const Navbar2: FC = () => {
  return (
    <Nav>
      <Logo>✈️ Авиа-Стиль</Logo>
      <NavLinks>
        <LinkItem href="#">Маршруты</LinkItem>
        <LinkItem href="#">Флот</LinkItem>
        <LinkItem href="#">История</LinkItem>
        <LinkItem href="#">Контакты</LinkItem>
      </NavLinks>

      <FlightZone>
        <Track>
          <FirstUnit>
            <FlyingGroup />
          </FirstUnit>
          <SecondUnit>
            <FlyingGroup />
          </SecondUnit>
        </Track>
      </FlightZone>
    </Nav>
  );
};


export default Navbar2;