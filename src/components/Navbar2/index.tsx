import { FC } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Анимации ---
const flyAcross = keyframes`
  0% {
    left: -380px;
  }
  10% {
    left: -60px;
  }
  85% {
    left: calc(100% - 280px);
  }
  100% {
    left: calc(100% + 320px);
  }
`;

const gentleBob = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const spinPropeller = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// --- Стилизованные компоненты ---
const Nav = styled.nav`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.8rem 2rem;
  background: rgba(10, 25, 35, 0.88);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 200, 100, 0.6);
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

// Контейнер для летающей группы (абсолютный слой)
const FlightZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  z-index: 5;
`;

// Группа, которая движется как единый состав (самолёт + надпись + трос)
const FlyingTrain = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${flyAcross} 10s cubic-bezier(0.2, 0.1, 0.2, 1) infinite;
  will-change: left;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
`;

// Эффект лёгкого покачивания всей связки
const BobbingGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${gentleBob} 2.2s ease-in-out infinite;
`;

// Стиль баннера / вымпела, который тянет самолёт
const Banner = styled.div`
  background: linear-gradient(135deg, #2e1b0e, #5a3a24);
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

// Декоративный трос (цепочка, соединяющая баннер и самолёт)
const TowCable = styled.div`
  width: 38px;
  height: 3px;
  background: repeating-linear-gradient(90deg, #b87c3a, #b87c3a 6px, #dba551 6px, #dba551 12px);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.4);
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

// SVG самолёта (кукурузник Ан-2)
const PlaneSVG = styled.svg`
  width: 190px;
  height: auto;
  display: block;
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.2));
  transition: all 0.1s;

  @media (max-width: 768px) {
    width: 150px;
  }
  @media (max-width: 480px) {
    width: 130px;
  }
`;

// Компонент навигации с пролетающим кукурузником
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
        <FlyingTrain>
          <BobbingGroup>
            <Banner>Режим StandIn</Banner>
            <TowCable />
            <PlaneSVG viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bodyGreen" x1="0%" y1="0%" x2="100%" y2="40%">
                  <stop offset="0%" stop-color="#1e6b2f" />
                  <stop offset="60%" stop-color="#3ca04f" />
                  <stop offset="100%" stop-color="#165b24" />
                </linearGradient>
                <linearGradient id="wingGold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#f5c542" />
                  <stop offset="100%" stop-color="#c2811a" />
                </linearGradient>
                <filter id="shadow" x="-5%" y="-5%" width="120%" height="120%">
                  <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodOpacity="0.4" />
                </filter>
              </defs>

              <g filter="url(#shadow)">
                {/* Верхнее крыло (основное) */}
                <rect x="28" y="16" width="112" height="13" rx="4" fill="url(#wingGold)" stroke="#7a5313" strokeWidth="0.8" />
                {/* Законцовки */}
                <rect x="26" y="14" width="5" height="17" rx="1.5" fill="#c9942c" />
                <rect x="136" y="14" width="5" height="17" rx="1.5" fill="#c9942c" />

                {/* Фюзеляж */}
                <rect x="45" y="28" width="98" height="23" rx="10" fill="url(#bodyGreen)" stroke="#0e4219" strokeWidth="0.8" />

                {/* Хвостовое горизонтальное оперение */}
                <rect x="137" y="36" width="27" height="7" rx="2" fill="#bb882c" stroke="#6b4c1a" strokeWidth="0.6" />
                {/* Киль */}
                <polygon points="152,28 164,14 168,28" fill="#e6b642" stroke="#805d1f" strokeWidth="0.6" />

                {/* Пропеллер с вращением */}
                <g style={{ transformOrigin: '45px 39.5px', animation: `${spinPropeller} 0.24s linear infinite` }}>
                  <circle cx="45" cy="39.5" r="5" fill="#5a3e1a" stroke="#32200b" strokeWidth="1.2" />
                  <rect x="40" y="26" width="10" height="27" rx="3" fill="#b8860b" stroke="#7a4900" strokeWidth="0.8" />
                  <rect x="31" y="36" width="28" height="7" rx="3" fill="#dba130" stroke="#7a4900" strokeWidth="0.6" />
                </g>

                {/* Иллюминаторы */}
                <circle cx="74" cy="36" r="3" fill="#a1defa" stroke="#204c5e" strokeWidth="0.7" />
                <circle cx="88" cy="36" r="3" fill="#a1defa" stroke="#204c5e" strokeWidth="0.7" />
                <circle cx="102" cy="36" r="3" fill="#a1defa" stroke="#204c5e" strokeWidth="0.7" />
                <rect x="54" y="32" width="11" height="8" rx="2" fill="#c2ecff" stroke="#204c5e" strokeWidth="0.7" />

                {/* НАДПИСЬ НА ФЮЗЕЛЯЖЕ "КУКУРУЗНИК" */}
                <text x="99" y="46" fontFamily="'Segoe UI', 'Arial Black', sans-serif" fontSize="9" fontWeight="900" fill="#FFF2C9" stroke="#15471f" strokeWidth="0.4" textAnchor="middle" letterSpacing="1.2">КУКУРУЗНИК</text>
                <text x="146" y="47" fontFamily="monospace" fontSize="5.5" fill="#FFE8B6" fontWeight="bold">АН-2</text>

                {/* Декоративные полосы */}
                <line x1="60" y1="43" x2="134" y2="43" stroke="#FFF3BB" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.8" />

                {/* Шасси (колёса) */}
                <rect x="70" y="51" width="13" height="4" rx="2" fill="#4e3a22" />
                <rect x="115" y="51" width="13" height="4" rx="2" fill="#4e3a22" />
                <circle cx="76.5" cy="55.5" r="3.2" fill="#2b2b27" stroke="#767464" strokeWidth="0.6" />
                <circle cx="121.5" cy="55.5" r="3.2" fill="#2b2b27" stroke="#767464" strokeWidth="0.6" />
                <line x1="76.5" y1="51" x2="76.5" y2="55.5" stroke="#7a6233" strokeWidth="1.2" />
                <line x1="121.5" y1="51" x2="121.5" y2="55.5" stroke="#7a6233" strokeWidth="1.2" />
              </g>
            </PlaneSVG>
          </BobbingGroup>
        </FlyingTrain>
      </FlightZone>
    </Nav>
  );
};


export default Navbar2;
