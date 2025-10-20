import Lottie from 'lottie-react';
import coinsData from './coins.json';

export default function CoinsAnimation() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30%',
        right: '5%',
        width: '350px',
        opacity: 0.15,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Lottie animationData={coinsData} loop autoplay />
    </div>
  );
}
