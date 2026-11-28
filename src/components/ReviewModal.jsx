import { useState } from 'react';
import { X, Star, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PRESET_TAGS = [
  '100% Original Phone',
  'Accurate Battery Health',
  'Fast WhatsApp Reply',
  'Friendly Shopkeeper',
  'Official PTA Approved',
  'Fair Market Price',
  'Clean Like-New Condition',
  'Smooth Counter Pickup',
];

const RATING_DESCRIPTIONS = {
  5: { label: 'Outstanding (5/5)', color: 'text-amber-500', desc: '100% Recommended in Bahawalnagar' },
  4: { label: 'Very Good (4/5)', color: 'text-emerald-500', desc: 'Satisfied with product & service' },
  3: { label: 'Average (3/5)', color: 'text-yellow-600', desc: 'Standard experience' },
  2: { label: 'Below Expectations (2/5)', color: 'text-orange-500', desc: 'Had some issues' },
  1: { label: 'Disappointing (1/5)', color: 'text-rose-500', desc: 'Not recommended' },
};

export default function ReviewModal({
  isOpen,
  onClose,
  targetType = 'shop', // 'shop' | 'product'
  targetTitle = '',
  shopId = null,
  productId = null,
  onSuccess = null,
}) {
  const { addReview, currentUser } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(currentUser?.name || '');
  const [city, setCity] = useState('Model Town, Bahawalnagar');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['100% Original Phone']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentScore = hoverRating || rating;
  const ratingInfo = RATING_DESCRIPTIONS[currentScore] || RATING_DESCRIPTIONS[5];

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please provide your name');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMsg('Please write a brief review (at least 5 characters)');
      return;
    }

    setErrorMsg('');

    const newReview = addReview({
      targetType,
      targetId: shopId || productId,
      shopId,
      productId,
      userName: name.trim(),
      city: city.trim() || 'Bahawalnagar',
      rating,
      comment: comment.trim(),
      tags: selectedTags,
    });

    setIsSubmitted(true);
    if (onSuccess) onSuccess(newReview);

    setTimeout(() => {
      setIsSubmitted(false);
      setComment('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#8586f2]/10 flex items-center justify-center text-[#8586f2]">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black text-black">Write a Review</h2>
              <p className="text-[11px] text-gray-500 truncate max-w-[240px]">
                {targetTitle || (targetType === 'shop' ? 'Shop Review' : 'Product Review')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center active:scale-95 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 animate-in zoom-in-75">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-base font-black text-black">Thank You!</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Your verified review has been submitted to Bahawal Market.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto hide-scrollbar p-5 space-y-4">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold px-3.5 py-2 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Star Rating Selector */}
            <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 text-center">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Overall Experience Rating
              </span>
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 active:scale-125 transition-transform"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      size={28}
                      className={
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className={`text-xs font-black ${ratingInfo.color}`}>
                  {ratingInfo.label}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-[11px] text-gray-500 font-medium">{ratingInfo.desc}</span>
              </div>
            </div>

            {/* Quick Experience Tags */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
                Quick Highlights (Tap to select)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-[#8586f2] text-white border-[#8586f2] font-bold shadow-xs'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 font-medium'
                      }`}
                    >
                      {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Comment Field */}
            <div>
              <label className="block text-[11px] font-bold text-black mb-1">
                Your Review <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share genuine details about phone condition, packaging, battery health, shopkeeper behavior, or pickup experience in Bahawalnagar..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Reviewer Details (Name & Location) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-black mb-1">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-black mb-1">
                  Area / City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Model Town, BWN"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-gray-400 focus:outline-none focus:border-[#8586f2] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Safety & Authenticity Notice */}
            <div className="bg-[#8586f2]/5 rounded-xl p-2.5 flex items-center gap-2 border border-[#8586f2]/15">
              <span className="text-xs">🛡️</span>
              <p className="text-[10px] text-gray-600 leading-tight">
                All reviews on Bahawal Market are from verified local buyers in Bahawalnagar.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#8586f2] hover:bg-[#7375e8] text-white rounded-full text-xs font-bold active:scale-98 transition-transform shadow-md shadow-[#8586f2]/20 flex items-center justify-center gap-2"
              >
                <MessageSquare size={15} />
                <span>Submit Verified Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
