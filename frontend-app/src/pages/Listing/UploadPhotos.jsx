import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingWizardLayout from '../../components/listing/ListingWizardLayout';
import { useListing } from '../../context/ListingContext';
import { Camera, Upload, Trash2, CheckCircle2, ArrowRight, ArrowLeft, Image as ImageIcon, Sparkles } from 'lucide-react';

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1532012164546-f432f2e3edd3?auto=format&fit=crop&q=80&w=600'
];

export default function UploadPhotos() {
  const navigate = useNavigate();
  const { listingData, updateListingData } = useListing();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const photos = listingData.photos || [];

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      alert("You can upload a maximum of 5 photos.");
      return;
    }

    const filesToRead = Array.from(files).slice(0, remainingSlots);
    const newPhotos = [];

    let processed = 0;
    filesToRead.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        newPhotos.push(e.target.result);
        processed++;
        if (processed === filesToRead.length) {
          const updated = [...photos, ...newPhotos];
          updateListingData({ 
            photos: updated,
            cover: updated[0] || listingData.cover
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAddSample = (url) => {
    if (photos.includes(url) || photos.length >= 5) return;
    const updated = [...photos, url];
    updateListingData({ 
      photos: updated,
      cover: updated[0] || listingData.cover
    });
  };

  const handleRemovePhoto = (index) => {
    const updated = photos.filter((_, i) => i !== index);
    updateListingData({ 
      photos: updated,
      cover: updated[0] || listingData.cover
    });
  };

  return (
    <ListingWizardLayout
      currentStep={3}
      title="Upload Book Photos"
      subtitle="Clear, authentic photos build buyer trust and eliminate condition disputes."
    >
      <div className="space-y-8">
        
        {/* Hidden Native File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,image/jpg"
          multiple
          className="hidden"
        />

        {/* Upload Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3 ${
            isDragging
              ? 'border-[#6C4BF4] bg-[#EEEAFE]/50 scale-[1.01]'
              : 'border-[#6C4BF4]/40 hover:border-[#6C4BF4] bg-[#EEEAFE]/20 hover:bg-[#EEEAFE]/40'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#EEEAFE] text-[#6C4BF4] flex items-center justify-center shadow-xs">
            <Camera size={26} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#17152A]">
              Click to Upload Photos or Drag and Drop
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG or WEBP (Up to 5 photos, max 5MB each)
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#6C4BF4] font-bold text-xs rounded-xl shadow-2xs hover:bg-gray-50 transition pointer-events-none"
          >
            <Upload size={14} /> Select from Your Device
          </button>
        </div>

        {/* Uploaded Photos Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Photos ({photos.length} / 5)
            </span>
            {photos.length === 0 && (
              <span className="text-xs text-amber-600 font-semibold">At least 1 photo recommended</span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((url, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 aspect-3/4 group shadow-xs"
              >
                <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-[#6C4BF4] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    Primary Cover
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto(index);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#6C4BF4] bg-gray-50/50 hover:bg-[#EEEAFE]/20 flex flex-col items-center justify-center aspect-3/4 text-gray-400 hover:text-[#6C4BF4] transition cursor-pointer p-4 text-center"
              >
                <Upload size={20} className="mb-1" />
                <span className="text-[11px] font-bold">+ Add Photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="bg-[#F8F7FF] p-4 rounded-2xl border border-gray-200/70 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#17152A]">
            <Sparkles size={14} className="text-[#6C4BF4]" />
            <span>Need sample images for testing?</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PHOTOS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddSample(sample)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:text-[#6C4BF4] hover:border-[#6C4BF4] transition cursor-pointer shadow-2xs"
              >
                + Add Sample Photo #{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate('/sell/condition')}
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={() => navigate('/sell/transaction')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6C4BF4] hover:bg-[#5B3DE0] text-white font-bold rounded-xl text-sm transition shadow-md shadow-[#6C4BF4]/25 cursor-pointer"
          >
            Continue to Mode <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </ListingWizardLayout>
  );
}
