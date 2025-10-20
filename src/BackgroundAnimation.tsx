import Lottie from 'lottie-react';
import cards from './cards.json';
import dices from './dices.json';

export default function BackgroundAnimation() {
  return (
    <>
      {/* Left side - Dices */}
      <div
        style={{
          position: 'fixed',
          top: '10%',
          left: '2%',
          width: '300px',
          opacity: 0.35,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Lottie animationData={dices} loop autoplay />
      </div>

      {/* Right side - Cards */}
      <div
        style={{
          position: 'fixed',
          bottom: '5%',
          right: '2%',
          width: '300px',
          opacity: 0.35,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Lottie animationData={cards} loop autoplay />
      </div>
    </>
  );
}
