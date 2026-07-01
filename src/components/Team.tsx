import { teamMembers } from '../data';
import { ChefHat, GraduationCap, Utensils } from 'lucide-react';

export default function Team() {
  return (
    <section id="equipe" className="py-24 bg-warm-100 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Intro */}
        <div className="text-center mb-16">
          <span className="font-sans font-bold text-[10px] md:text-xs text-gold-700 tracking-[0.3em] uppercase block mb-3">
            LES ARTISANS DU GOÛT
          </span>
          <h2 className="text-3xl sm:text-[42px] font-title font-semibold text-warm-900 tracking-[-0.5px] leading-[1.2] mb-4">
            L'Équipe de Cuisine
          </h2>
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <span className="h-[1px] w-12 bg-gold-500/50 block" />
            <span className="text-[10px] text-gold-500">✦</span>
            <span className="h-[1px] w-12 bg-gold-500/50 block" />
          </div>
          <p className="text-warm-800 font-sans text-sm sm:text-base max-w-2xl mx-auto">
            Rencontrez les virtuoses passionnés qui orchestrent quotidiennement la symphonie des saveurs de l'Escale du Pont.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-8" id="team-grid">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-md border border-warm-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
            >
              {/* Photo */}
              <div className="relative h-72 w-full overflow-hidden select-none bg-warm-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-serif font-bold text-lg">{member.name}</h4>
                  <p className="font-sans text-xs text-gold-200 uppercase tracking-widest font-semibold">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Bio Details */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <p className="text-warm-800 font-sans text-xs sm:text-sm leading-relaxed">
                  {member.bio}
                </p>

                {member.signatureDish && (
                  <div className="pt-4 border-t border-warm-100 flex items-center gap-2 text-xs">
                    <div className="bg-gold-50 p-1.5 rounded text-gold-700 border border-gold-100 shrink-0">
                      <ChefHat size={14} />
                    </div>
                    <div>
                      <span className="text-[10px] text-warm-800 uppercase tracking-wider block font-bold">
                        Spécialité Signature
                      </span>
                      <span className="font-serif font-bold text-warm-900">
                        {member.signatureDish}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Small Accolades Footer */}
        <div className="mt-16 bg-white border border-warm-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-gold-50 p-3 rounded-full text-gold-700 border border-gold-100">
              <GraduationCap size={24} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-warm-900 leading-tight">Formations prestigieuses</h4>
              <p className="text-xs text-warm-800 font-sans mt-0.5">
                Nos cuisiniers et sommeliers sont formés dans les plus célèbres écoles hôtelières et d'œnologie.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gold-50 p-3 rounded-full text-gold-700 border border-gold-100">
              <Utensils size={24} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-warm-900 leading-tight">Zéro gaspillage & Éco-responsabilité</h4>
              <p className="text-xs text-warm-800 font-sans mt-0.5">
                Une brigade moderne engagée pour une cuisine respectueuse de l'environnement au quotidien.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
