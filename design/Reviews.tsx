
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { CURRENT_USER } from '../constants';

const Reviews: React.FC = () => {
  const navigate = useNavigate();

  // Mock Data
  const reviews = [
    { id: 1, user: 'Marko P.', rating: 5, comment: 'Sve po dogovoru, preporuke!', date: 'Prije 2 dana', avatar: 'https://picsum.photos/seed/marko/100/100' },
    { id: 2, user: 'Ivan K.', rating: 5, comment: 'Brz dogovor i realizacija.', date: 'Prije 5 dana', avatar: 'https://picsum.photos/seed/ivan/100/100' },
    { id: 3, user: 'Ana S.', rating: 4, comment: 'Artikal kao na slikama, sve ok.', date: 'Prije 1 sedmicu', avatar: 'https://picsum.photos/seed/ana/100/100' },
    { id: 4, user: 'Damir H.', rating: 1, comment: 'Nije se javio na telefon.', date: 'Prije 2 sedmice', avatar: 'https://picsum.photos/seed/damir/100/100' },
  ];

  const ratings = { 5: 15, 4: 4, 3: 3, 2: 0, 1: 1 };
  const totalReviews = 23;
  const averageRating = 4.7;

  return (
    <Layout title="Dojmovi" showSigurnost={false} headerRight={<button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"><i className="fa-solid fa-arrow-left"></i></button>}>
      <div className="pt-4 pb-24 px-4 md:px-0 max-w-2xl mx-auto space-y-6">
        
        {/* Header Summary */}
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-sm border border-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                <i className="fa-solid fa-star text-2xl text-yellow-500"></i>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Dojmovi Korisnika</h1>
            <p className="text-xs text-gray-500">Šta drugi kažu o saradnji sa <span className="text-white font-bold">@{CURRENT_USER.username}</span></p>
        </div>

        {/* Stats Card */}
        <div className="bg-[#121C26] border border-white/5 rounded-sm p-6 flex items-center gap-6">
             <div className="flex flex-col items-center justify-center min-w-[100px]">
                 <span className="text-5xl font-black text-white leading-none">{averageRating}</span>
                 <div className="flex text-yellow-500 text-[10px] gap-0.5 my-2">
                     <i className="fa-solid fa-star"></i>
                     <i className="fa-solid fa-star"></i>
                     <i className="fa-solid fa-star"></i>
                     <i className="fa-solid fa-star"></i>
                     <i className="fa-solid fa-star-half-stroke"></i>
                 </div>
                 <span className="text-[9px] text-gray-500 uppercase tracking-widest">{totalReviews} Dojmova</span>
             </div>
             
             <div className="flex-1 space-y-2 border-l border-white/5 pl-6">
                 {[5,4,3,2,1].map(star => (
                     <div key={star} className="flex items-center gap-3">
                         <span className="text-[9px] font-bold text-gray-500 w-3">{star}</span>
                         <div className="flex-1 h-1.5 bg-[#0B151E] rounded-sm overflow-hidden">
                             <div 
                                className={`h-full rounded-sm ${star >= 4 ? 'bg-blue-600' : star === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${(ratings[star as keyof typeof ratings] / totalReviews) * 100}%` }}
                             ></div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>

        {/* Reviews List */}
        <div>
             <div className="flex justify-between items-end mb-4 px-1">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Zadnji Dojmovi</h3>
                <button className="text-[10px] font-bold text-blue-400 uppercase tracking-widest hover:text-white">Filtriraj</button>
             </div>
             
             <div className="space-y-3">
                {reviews.map(review => (
                    <div key={review.id} className="bg-[#121C26] border border-white/5 rounded-sm p-4 hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-700 rounded-sm overflow-hidden">
                                    <img src={review.avatar} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">{review.user}</h4>
                                    <div className="flex text-yellow-500 text-[8px] gap-0.5 mt-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className={`fa-solid fa-star ${i < review.rating ? '' : 'text-gray-700'}`}></i>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[9px] text-gray-600 font-mono">{review.date}</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed pl-11">{review.comment}</p>
                    </div>
                ))}
             </div>
        </div>

        <button className="w-full py-4 bg-[#121C26] border border-white/5 rounded-sm text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest hover:bg-white/5">
            Učitaj više
        </button>

      </div>
    </Layout>
  );
};

export default Reviews;
