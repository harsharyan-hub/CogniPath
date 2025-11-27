import React, { useState, useEffect } from 'react';
import { Review, User } from '../types';
import { Star, MessageSquare, User as UserIcon } from 'lucide-react';

interface ReviewsProps {
  currentUser: User;
}

const Reviews: React.FC<ReviewsProps> = ({ currentUser }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('scholar_reviews');
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    const newReview: Review = {
      id: crypto.randomUUID(),
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('scholar_reviews', JSON.stringify(updated));
    setComment('');
    setRating(5);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Student Success Stories</h1>
        <p className="text-slate-500 mt-2">See what others are saying about CogniPath and share your experience.</p>
      </div>

      {/* Review Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Your Experience</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How has CogniPath helped you?"
              className="w-full h-24 p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Review List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={review.userAvatar} alt={review.userName} className="w-10 h-10 rounded-full border border-slate-100" />
                  <div>
                    <p className="font-semibold text-slate-900">{review.userName}</p>
                    <p className="text-xs text-slate-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="relative">
                <MessageSquare className="absolute -top-1 -left-1 w-4 h-4 text-indigo-100 transform -scale-x-100" />
                <p className="text-slate-600 text-sm leading-relaxed pl-2">{review.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <UserIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-medium">No reviews yet</h3>
            <p className="text-slate-500 text-sm">Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;