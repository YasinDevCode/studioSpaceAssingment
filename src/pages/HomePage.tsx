import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Studio } from '../types';
import { CATEGORY_DETAILS, STUDIO_CATEGORIES } from '../types';
import { apiRequest } from '../lib/api';
import { StudioCard } from '../components/StudioCard';
import { StudioCardSkeleton } from '../components/Skeletons';
import { StudioImage } from '../components/StudioImage';
import { GUARANTEES, HERO_SLIDES, TESTIMONIALS, WORKFLOW_STEPS } from '../data/homeContent';

export function HomePage() {
  const [featuredStudios, setFeaturedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest<{ studios: Studio[] }>('/api/studios?limit=6&sort=rating')
      .then((res) => {
        if (active) setFeaturedStudios(res.studios || []);
      })
      .catch(() => {
        if (active) setFeaturedStudios([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* Hero Interactive Slider (Swiper.js) */}
      <section className="relative bg-zinc-950 overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          loop
          speed={650}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: '.hero-prev-btn',
            nextEl: '.hero-next-btn',
          }}
          className="studiospace-swiper h-[560px] sm:h-[620px] lg:h-[660px]"
        >
          {HERO_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full">
                <StudioImage
                  src={slide.image}
                  alt={slide.headline}
                  className="w-full h-full object-cover"
                />
                {/* Measured high-contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-zinc-950/25" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/20" />

                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl space-y-6">
                      <p className="text-sm font-medium text-blue-300 tracking-tight">
                        {slide.kicker}
                      </p>
                      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.06] text-balance">
                        {slide.headline}
                      </h1>
                      <p className="text-base sm:text-lg text-zinc-200 leading-relaxed max-w-xl">
                        {slide.subtext}
                      </p>
                      <div className="pt-2 flex flex-wrap items-center gap-3.5">
                        <Link
                          to={slide.primaryTo}
                          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                        >
                          <span>{slide.primaryLabel}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                          to={slide.secondaryTo}
                          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/12 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                        >
                          <span>{slide.secondaryLabel}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom desktop slider controls */}
        <div className="hidden sm:flex items-center gap-2 absolute bottom-6 right-8 z-20">
          <button
            type="button"
            aria-label="Previous slide"
            className="hero-prev-btn w-10 h-10 rounded-lg bg-zinc-950/60 hover:bg-zinc-950/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="hero-next-btn w-10 h-10 rounded-lg bg-zinc-950/60 hover:bg-zinc-950/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Featured Studios Section (Dynamic .limit(6)) */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Curated Collection
              </p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
                Featured Production Studios
              </h2>
            </div>
            <Link
              to="/studios"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
            >
              <span>Browse all workspaces</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <StudioCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStudios.map((studio) => (
                <StudioCard key={studio.id} studio={studio} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Browse by Studio Categories */}
      <section className="py-20 bg-white dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Browse by Discipline
            </p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
              Spaces engineered for every creative format
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {STUDIO_CATEGORIES.map((category) => {
              const info = CATEGORY_DETAILS[category];
              return (
                <Link
                  key={category}
                  to={`/studios?category=${encodeURIComponent(category)}`}
                  className="group h-full flex flex-col rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                    <StudioImage
                      src={info.image}
                      alt={info.pluralLabel}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-zinc-950 dark:text-zinc-50 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {info.pluralLabel}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5 shrink-0" />
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {info.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Extra Section 1: How Booking Works (4-Step Workflow) */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Production Workflow
              </p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
                How booking works on StudioSpace
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-700 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
            >
              <span>Read the full booking guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((item) => (
              <div
                key={item.step}
                className="h-full flex flex-col p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
              >
                <span className="font-mono text-sm font-semibold text-blue-700 dark:text-blue-400 tabular-nums">
                  {item.step}.
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section 2: Host Guarantee & Creator Support */}
      <section className="py-20 bg-white dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Host Guarantee & Support
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 text-balance">
                Built to protect studio owners and working crews alike
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Whether you are opening your private cyclorama between campaigns or booking a
                full sound stage for a commercial crew, StudioSpace enforces verified profiles,
                transparent deposit handling, and strict double-booking prevention.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/add-studio"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-blue-700 dark:hover:bg-blue-500 dark:hover:text-white text-sm font-semibold transition-colors"
                >
                  <span>List Your Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-semibold transition-colors"
                >
                  <span>About Our Coverage</span>
                </Link>
              </div>

              {/* Adjacent Proof Quotes */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-5">
                {TESTIMONIALS.map((t) => (
                  <blockquote key={t.author} className="space-y-2">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      “{t.quote}”
                    </p>
                    <footer className="text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {t.author}
                      </span>{' '}
                      · {t.role}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {GUARANTEES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="h-full flex flex-col p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
