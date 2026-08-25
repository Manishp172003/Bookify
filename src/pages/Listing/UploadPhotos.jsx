import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadPhotos() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    setImages(prev => {
      const updated = [...prev];
      for (let i = 0; i < imageFiles.length; i++) {
        if (updated.length >= 6) break;
        updated.push({
          id: Math.random().toString(36).substring(2, 9),
          url: URL.createObjectURL(imageFiles[i]),
          name: imageFiles[i].name
        });
      }
      return updated;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeImage = (id) => {
    setImages(prev => {
      const target = prev.find(img => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/sell/condition')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition font-inter cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Condition
      </button>

      <div className="bg-cards p-6 md:p-10 rounded-3xl border border-gray-200/50 shadow-xs">
        <h1 className="text-3xl font-extrabold text-text-main mb-2 font-poppins">Upload Photos</h1>
        <p className="text-gray-500 font-inter text-sm mb-8">
          Add up to 6 high-quality photos. Show the front cover, back cover, spine, and any wear to build buyer trust.
        </p>

        {/* Drag & Drop Upload Container */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 hover:border-primary/60 bg-background/50 hover:bg-background'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
          
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <h3 className="font-bold text-text-main text-lg font-poppins mb-1">
            Drag & drop images here
          </h3>
          <p className="text-gray-500 font-inter text-xs mb-4">
            or click to browse from your device
          </p>

          <span className="inline-block bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl transition font-inter shadow-xs">
            Choose Photos
          </span>

          <div className="mt-4 text-xs font-medium text-gray-400 font-inter">
            Maximum 6 photos. Upload progress: {images.length}/6
          </div>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="mt-8">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 font-inter">
              Uploaded Previews
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {images.map((img) => (
                <div 
                  key={img.id} 
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group"
                >
                  <img 
                    src={img.url} 
                    alt="Upload Preview" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Remove Button Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering parent folder browser input
                      removeImage(img.id);
                    }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate('/sell/condition')}
            className="px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer font-inter"
          >
            Back
          </button>
          <button
            onClick={() => navigate('/sell/transaction')}
            className="px-8 py-3.5 bg-cta hover:bg-cta/90 text-white font-bold rounded-xl text-sm transition font-inter shadow-xs cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
