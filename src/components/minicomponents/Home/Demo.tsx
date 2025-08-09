import React from 'react';

const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";
const screenshots = ["/screenshot1.png", "/screenshot2.png"];

const ProductDemoSection: React.FC = () => (
  <section className="product-demo-section">
    <h2>See It In Action</h2>
    <div className="video-demo">
      <iframe src={videoUrl} title="Product Demo" frameBorder="0" allowFullScreen />
    </div>
    <div className="screenshots">
      {screenshots.map((src, idx) => (
        <img key={idx} src={src} alt={`Screenshot ${idx + 1}`} />
      ))}
    </div>
  </section>
);

export default ProductDemoSection;