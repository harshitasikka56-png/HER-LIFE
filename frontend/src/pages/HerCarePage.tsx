import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Star, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  X, 
  MapPin, 
  Check, 
  Package, 
  Gift, 
  Coffee, 
  Smile, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Share2,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { LotusBloomIcon } from '../components/common/LotusBloomIcon';
import { UserProfile, PeriodPrediction, DailyLogRecord } from '../types';
import { api } from '../services/api';
import { 
  MarketplaceProduct, 
  MarketplaceCategory, 
  MARKETPLACE_CATEGORIES, 
  MARKETPLACE_PRODUCTS,
  CARE_KIT_OPTIONS,
  RetailerOption
} from '../data/herCareCatalog';
import { Language, translations } from '../services/i18n';
import { useBackHandler } from '../services/backNavigation';

interface HerCarePageProps {
  currentUser: UserProfile;
  onNavigateTab: (tab: any) => void;
  onBack?: () => void;
  language: Language;
}

const FAVORITES_STORAGE_KEY = 'herlife_marketplace_favorites';
const USER_CITY_KEY = 'herlife_user_city';

export const HerCarePage: React.FC<HerCarePageProps> = ({
  currentUser,
  onNavigateTab,
  onBack,
  language
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>('all');
  const [budgetFilter, setBudgetFilter] = useState<'all' | 'under200' | '200_499' | '500plus'>('all');
  const [onlyInstantDelivery, setOnlyInstantDelivery] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['pe-whisper-xl', 'cc-amul-dark-choc'];
    } catch {
      return ['pe-whisper-xl', 'cc-amul-dark-choc'];
    }
  });

  // Cycle personalization
  const [prediction, setPrediction] = useState<PeriodPrediction | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLogRecord | null>(null);
  const [loadingCycle, setLoadingCycle] = useState(true);

  // Modals & Active Selections
  const [activeProduct, setActiveProduct] = useState<MarketplaceProduct | null>(null);
  const [retailerModalProduct, setRetailerModalProduct] = useState<MarketplaceProduct | null>(null);
  const [showKitBuilder, setShowKitBuilder] = useState(false);
  const [userCity, setUserCity] = useState<string>(() => {
    return localStorage.getItem(USER_CITY_KEY) || 'Mumbai';
  });
  const [showCityModal, setShowCityModal] = useState(false);

  // Custom Kit Builder State
  const [kitEssential, setKitEssential] = useState<string>(CARE_KIT_OPTIONS.essentials[0].id);
  const [kitCraving, setKitCraving] = useState<string>(CARE_KIT_OPTIONS.cravings[0].id);
  const [kitComfort, setKitComfort] = useState<string>(CARE_KIT_OPTIONS.comfort[0].id);
  const [kitFeelGood, setKitFeelGood] = useState<string>(CARE_KIT_OPTIONS.feelGood[0].id);
  const [kitSavedToast, setKitSavedToast] = useState(false);

  // Back handler for Product Details modal
  useBackHandler(
    'hercare_product_detail',
    85,
    () => {
      if (activeProduct) {
        setActiveProduct(null);
        return true;
      }
      return false;
    },
    Boolean(activeProduct)
  );

  // Back handler for Retailer Delivery modal
  useBackHandler(
    'hercare_retailer_modal',
    85,
    () => {
      if (retailerModalProduct) {
        setRetailerModalProduct(null);
        return true;
      }
      return false;
    },
    Boolean(retailerModalProduct)
  );

  // Back handler for City Selection modal
  useBackHandler(
    'hercare_city_modal',
    80,
    () => {
      if (showCityModal) {
        setShowCityModal(false);
        return true;
      }
      return false;
    },
    showCityModal
  );

  // Back handler for Kit Builder section
  useBackHandler(
    'hercare_kit_builder',
    75,
    () => {
      if (showKitBuilder) {
        setShowKitBuilder(false);
        return true;
      }
      return false;
    },
    showKitBuilder
  );

  // Carousel refs for smooth scroll
  const emergencyCarouselRef = useRef<HTMLDivElement>(null);
  const personalizedCarouselRef = useRef<HTMLDivElement>(null);

  // Load cycle prediction and today's log
  useEffect(() => {
    let isMounted = true;
    async function loadCycleInfo() {
      try {
        const [pred, log] = await Promise.all([
          api.getPeriodPrediction(currentUser.id),
          api.getTodayLog(currentUser.id)
        ]);
        if (isMounted) {
          setPrediction(pred);
          setTodayLog(log);
        }
      } catch (err) {
        console.error("HerCare cycle load error:", err);
      } finally {
        if (isMounted) setLoadingCycle(false);
      }
    }
    loadCycleInfo();
    return () => { isMounted = false; };
  }, [currentUser]);

  // Persist favorites
  const toggleFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Detect cycle status
  const cycleStatus = useMemo(() => {
    const isPeriodToday = todayLog?.period_day_flag || false;
    const currentDay = prediction?.current_cycle_day || 0;
    
    // Check if period is in progress
    if (isPeriodToday || (currentDay >= 1 && currentDay <= 5)) {
      return {
        type: 'period_active',
        day: currentDay || 1,
        title: `Period Flow Days (Cycle Day ${currentDay || 1}) 🩸`,
        description: 'Prioritizing extra-absorbent pads, herbal cramp relief, hot water warmth & magnesium-rich dark chocolates.',
        recommendedCategory: 'period_essentials' as MarketplaceCategory
      };
    }

    // Check if period is expected soon
    if (prediction?.predicted_period_date) {
      const today = new Date();
      const predDate = new Date(prediction.predicted_period_date);
      const diffTime = predDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 4) {
        return {
          type: 'period_imminent',
          daysLeft: diffDays === 0 ? 'Today' : `${diffDays} days`,
          title: `Period Expected in ~${diffDays === 0 ? 'Today' : `${diffDays} Days`} 🌸`,
          description: 'Stock up before cramps begin: Hot water bags, chamomile teas, pantyliners & comfort plushies.',
          recommendedCategory: 'comfort_cravings' as MarketplaceCategory
        };
      }
    }

    // Follicular or Ovulation or Luteal
    if (currentDay > 5 && currentDay <= 14) {
      return {
        type: 'follicular',
        day: currentDay,
        title: `Cycle Day ${currentDay} • Follicular & Energy Phase 🌱`,
        description: 'Great time for clean nutrition, roasted makhana snacks, and light self-care treats.',
        recommendedCategory: 'self_care' as MarketplaceCategory
      };
    } else if (currentDay > 14 && currentDay <= 21) {
      return {
        type: 'ovulation',
        day: currentDay,
        title: `Cycle Day ${currentDay} • Ovulation Window 🌸`,
        description: 'Stay fresh and comfortable with breathable organic pantyliners and soothing mist.',
        recommendedCategory: 'period_essentials' as MarketplaceCategory
      };
    } else if (currentDay > 21) {
      return {
        type: 'luteal_pms',
        day: currentDay,
        title: `Cycle Day ${currentDay} • Luteal / PMS Prep 💜`,
        description: 'Hormonal breakout prevention: Hydrocolloid acne patches, calming lavender tea & dark chocolate.',
        recommendedCategory: 'comfort_cravings' as MarketplaceCategory
      };
    }

    return null;
  }, [prediction, todayLog]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return MARKETPLACE_PRODUCTS.filter(product => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesTag = product.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesTag) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Quick Delivery Filter
      if (onlyInstantDelivery && !product.quickDeliverable) {
        return false;
      }

      // 4. Favorites Filter
      if (onlyFavorites && !favorites.includes(product.id)) {
        return false;
      }

      // 5. Budget Filter
      if (budgetFilter === 'under200' && product.price > 200) return false;
      if (budgetFilter === '200_499' && (product.price < 200 || product.price > 499)) return false;
      if (budgetFilter === '500plus' && product.price < 500) return false;

      return true;
    });
  }, [searchQuery, selectedCategory, onlyInstantDelivery, onlyFavorites, budgetFilter, favorites]);

  // Carousels data
  const emergencyEssentials = useMemo(() => {
    return MARKETPLACE_PRODUCTS.filter(p => 
      ['pe-whisper-xl', 'cc-rubber-hotbag', 'cc-amul-dark-choc', 'cc-cramp-rollon', 'pe-nua-pads', 'cc-chamomile-tea'].includes(p.id)
    );
  }, []);

  const personalizedRecommendations = useMemo(() => {
    if (cycleStatus?.type === 'period_active') {
      return MARKETPLACE_PRODUCTS.filter(p => p.category === 'period_essentials' || p.category === 'comfort_cravings');
    }
    if (cycleStatus?.type === 'luteal_pms') {
      return MARKETPLACE_PRODUCTS.filter(p => p.tags.includes('acne patches') || p.category === 'comfort_cravings' || p.tags.includes('chocolate'));
    }
    return MARKETPLACE_PRODUCTS.filter(p => p.category === 'comfort_cravings' || p.category === 'gifts_feel_good');
  }, [cycleStatus]);

  // Custom kit price calculation
  const customKitDetails = useMemo(() => {
    const item1 = CARE_KIT_OPTIONS.essentials.find(i => i.id === kitEssential)!;
    const item2 = CARE_KIT_OPTIONS.cravings.find(i => i.id === kitCraving)!;
    const item3 = CARE_KIT_OPTIONS.comfort.find(i => i.id === kitComfort)!;
    const item4 = CARE_KIT_OPTIONS.feelGood.find(i => i.id === kitFeelGood)!;

    const totalPrice = (item1?.price || 0) + (item2?.price || 0) + (item3?.price || 0) + (item4?.price || 0);
    const bundleSavings = Math.round(totalPrice * 0.15); // 15% estimated bundle combo value
    const finalPrice = totalPrice - bundleSavings;

    return {
      items: [item1, item2, item3, item4].filter(Boolean),
      totalPrice,
      bundleSavings,
      finalPrice
    };
  }, [kitEssential, kitCraving, kitComfort, kitFeelGood]);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOrderCareKit = (retailer: 'Blinkit' | 'Zepto' | 'Amazon') => {
    // Open retailer with combined search query or first item
    const queries = customKitDetails.items.map(i => i.name.split(' ')[0]).join(' ');
    let url = '';
    if (retailer === 'Blinkit') url = `https://blinkit.com/s/?q=${encodeURIComponent('sanitary pads chocolate hot water bag')}`;
    else if (retailer === 'Zepto') url = `https://www.zeptonow.com/search?query=${encodeURIComponent('period care pads chocolate')}`;
    else url = `https://www.amazon.in/s?k=${encodeURIComponent('period care hamper kit')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-brand-500 to-amber-500 text-white p-6 sm:p-8 shadow-soft">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
        <div className="relative z-10 max-w-2xl">
          {onBack && (
            <div className="mb-2.5">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold shadow-2xs border border-white/25 transition active:scale-95"
                aria-label="Back to Previous Screen"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/25 flex items-center gap-1.5 shadow-2xs">
              <ShoppingBag className="w-3.5 h-3.5" />
              HER CARE Marketplace
            </span>
            <button
              onClick={() => setShowCityModal(true)}
              className="text-[11px] font-semibold bg-black/20 hover:bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 transition"
            >
              <MapPin className="w-3 h-3 text-rose-200" />
              <span>Deliver to: <strong>{userCity}</strong></span>
              <span className="text-[9px] bg-emerald-400 text-black font-extrabold px-1.5 py-0.2 rounded-full ml-1">10-15 Min</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight">
            HER CARE — Your Period Comfort Corner
          </h1>
          <p className="text-xs sm:text-sm text-white/90 mt-2 leading-relaxed max-w-xl">
            Pure organic pads, soothing heating bags, artisanal dark chocolate, cuddly plushies, and clean skincare — delivered to your doorstep in 10-15 minutes via Blinkit, Zepto & Amazon.
          </p>

          {/* Quick CTA to Kit Builder */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setShowKitBuilder(true);
                document.getElementById('kit-builder-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 bg-white text-brand-700 hover:bg-rose-50 font-bold text-xs sm:text-sm rounded-2xl shadow-soft flex items-center gap-2 transition transform active:scale-95"
            >
              <Gift className="w-4 h-4 text-rose-500" />
              <span>Build My Period Care Kit</span>
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-300" />
            </button>
            <span className="text-[11px] text-white/80 font-medium">
              Over 24+ gynecologist-reviewed comfort essentials
            </span>
          </div>
        </div>
      </div>

      {/* 2. Biological Intelligence & Cycle Personalization Banner */}
      {cycleStatus ? (
        <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-200/80 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white shadow-2xs border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
                <LotusBloomIcon className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-warm-textDark">
                    {cycleStatus.title}
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                    Auto-Personalized
                  </span>
                </div>
                <p className="text-xs text-warm-textMuted mt-0.5 leading-relaxed">
                  {cycleStatus.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setSelectedCategory(cycleStatus.recommendedCategory)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-rose-700 border border-rose-200 hover:bg-rose-100 transition shadow-2xs"
              >
                View Recommended Items →
              </button>
            </div>
          </div>
          <p className="text-[10px] text-warm-textMuted/70 italic mt-2.5 pt-2 border-t border-rose-200/50">
            Note: HER LIFE tailors comfort items to your recorded cycle calendar. You can freely browse any product anytime regardless of your phase.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-warm-border rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-brand-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-warm-textDark">Want tailored cycle comfort recommendations?</p>
              <p className="text-[11px] text-warm-textMuted">Log or confirm your cycle dates in Daily Check-in to unlock personalized suggestions.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('checkin')}
            className="text-xs font-bold text-brand-600 hover:text-brand-800 transition whitespace-nowrap"
          >
            Log Cycle Dates →
          </button>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-warm-textMuted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pads, dark chocolate, heating bag, chamomile tea, teddy..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-2xl bg-white border border-warm-border focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition placeholder:text-warm-textMuted font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-textMuted hover:text-warm-textDark p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Toggle Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {/* Instant Delivery Toggle */}
            <button
              onClick={() => setOnlyInstantDelivery(!onlyInstantDelivery)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition ${
                onlyInstantDelivery
                  ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                  : 'bg-white text-warm-textDark border-warm-border hover:bg-warm-cardMuted'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>⚡ 10-15 Min Delivery</span>
            </button>

            {/* Favorites Toggle */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition ${
                onlyFavorites
                  ? 'bg-rose-500 text-white border-rose-600 shadow-2xs'
                  : 'bg-white text-warm-textDark border-warm-border hover:bg-warm-cardMuted'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : ''}`} />
              <span>Favorites ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {MARKETPLACE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOnlyFavorites(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-500 text-white border-brand-500 shadow-soft scale-102'
                    : 'bg-white text-warm-textMuted border-warm-border hover:text-warm-textDark hover:bg-warm-cardMuted'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Budget Filter Chips */}
        <div className="flex items-center gap-2 text-xs text-warm-textMuted overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-warm-textDark shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-brand-500" />
            Budget:
          </span>
          {[
            { id: 'all', label: 'All Budgets' },
            { id: 'under200', label: 'Under ₹200' },
            { id: '200_499', label: '₹200 - ₹499' },
            { id: '500plus', label: '₹500+' }
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => setBudgetFilter(b.id as any)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition ${
                budgetFilter === b.id
                  ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                  : 'bg-white text-warm-textMuted border-warm-border hover:bg-gray-50'
              }`}
            >
              {b.label}
            </button>
          ))}

          {(searchQuery || selectedCategory !== 'all' || budgetFilter !== 'all' || onlyInstantDelivery || onlyFavorites) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setBudgetFilter('all');
                setOnlyInstantDelivery(false);
                setOnlyFavorites(false);
              }}
              className="text-[11px] font-bold text-brand-600 hover:text-brand-800 underline ml-auto shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. Animated Horizontal Product Carousels (When not searching) */}
      {!searchQuery && selectedCategory === 'all' && !onlyFavorites && (
        <div className="space-y-8">
          {/* Carousel 1: 10-Minute Emergency Period Care */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500">⚡</span>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-warm-textDark">
                    10-Minute Emergency Period Care
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                    Blinkit / Zepto Instant
                  </span>
                </div>
                <p className="text-xs text-warm-textMuted">Urgent relief when flow catches you off guard.</p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => scrollCarousel(emergencyCarouselRef, 'left')}
                  className="p-1.5 rounded-full border border-warm-border bg-white hover:bg-warm-cardMuted text-warm-textDark transition shadow-2xs"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel(emergencyCarouselRef, 'right')}
                  className="p-1.5 rounded-full border border-warm-border bg-white hover:bg-warm-cardMuted text-warm-textDark transition shadow-2xs"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div 
              ref={emergencyCarouselRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 scroll-smooth"
            >
              {emergencyEssentials.map(product => (
                <div 
                  key={`carousel-emergency-${product.id}`}
                  className="w-64 sm:w-72 shrink-0 bg-white rounded-2xl border border-warm-border p-3.5 shadow-2xs hover:shadow-soft transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  onClick={() => setActiveProduct(product)}
                >
                  <div>
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-warm-cardMuted mb-2.5">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-brand-700 shadow-2xs">
                          {product.badge}
                        </span>
                      )}
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-warm-textMuted hover:text-rose-500 shadow-2xs transition"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-warm-textMuted mb-1">
                      <span className="font-semibold text-brand-600">{product.brand}</span>
                      <span className="flex items-center gap-0.5 font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-warm-textDark line-clamp-2 leading-snug group-hover:text-brand-600 transition">
                      {product.name}
                    </h4>

                    <p className="text-[11px] text-warm-textMuted mt-1 line-clamp-1 italic">
                      {product.cycleBenefit}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-warm-border flex items-center justify-between">
                    <div>
                      <span className="font-serif font-black text-sm text-warm-textDark">₹{product.price}</span>
                      <span className="text-[10px] text-warm-textMuted line-through ml-1.5">₹{product.mrp}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRetailerModalProduct(product);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition transform active:scale-95"
                    >
                      <span>Shop</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel 2: Curated For You */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-rose-500">🌸</span>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-warm-textDark">
                    Recommended For Your Current Biological Rhythms
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                    Tailored Pick
                  </span>
                </div>
                <p className="text-xs text-warm-textMuted">Hormone-friendly pampering, teas, snacks & soothing comfort.</p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={() => scrollCarousel(personalizedCarouselRef, 'left')}
                  className="p-1.5 rounded-full border border-warm-border bg-white hover:bg-warm-cardMuted text-warm-textDark transition shadow-2xs"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollCarousel(personalizedCarouselRef, 'right')}
                  className="p-1.5 rounded-full border border-warm-border bg-white hover:bg-warm-cardMuted text-warm-textDark transition shadow-2xs"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div 
              ref={personalizedCarouselRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 scroll-smooth"
            >
              {personalizedRecommendations.map(product => (
                <div 
                  key={`carousel-pers-${product.id}`}
                  className="w-64 sm:w-72 shrink-0 bg-white rounded-2xl border border-warm-border p-3.5 shadow-2xs hover:shadow-soft transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  onClick={() => setActiveProduct(product)}
                >
                  <div>
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-warm-cardMuted mb-2.5">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-rose-700 shadow-2xs">
                          {product.badge}
                        </span>
                      )}
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-warm-textMuted hover:text-rose-500 shadow-2xs transition"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorites.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-warm-textMuted mb-1">
                      <span className="font-semibold text-brand-600">{product.brand}</span>
                      <span className="flex items-center gap-0.5 font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-warm-textDark line-clamp-2 leading-snug group-hover:text-brand-600 transition">
                      {product.name}
                    </h4>

                    <p className="text-[11px] text-warm-textMuted mt-1 line-clamp-1 italic">
                      {product.cycleBenefit}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-warm-border flex items-center justify-between">
                    <div>
                      <span className="font-serif font-black text-sm text-warm-textDark">₹{product.price}</span>
                      <span className="text-[10px] text-warm-textMuted line-through ml-1.5">₹{product.mrp}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRetailerModalProduct(product);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition transform active:scale-95"
                    >
                      <span>Shop</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. "Build My Period Care Kit" Interactive Builder */}
      <div 
        id="kit-builder-section"
        className="rounded-3xl bg-gradient-to-br from-rose-50 via-white to-purple-50 border-2 border-rose-200/70 p-5 sm:p-7 shadow-soft space-y-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <h2 className="text-lg sm:text-xl font-serif font-black text-warm-textDark">
                Build My Period Care Kit
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                15% Combo Value
              </span>
            </div>
            <p className="text-xs text-warm-textMuted mt-1">
              Assemble your custom 4-piece comfort box: choose your favorite essentials, snacks, and cuddly self-care.
            </p>
          </div>

          <button
            onClick={() => setShowKitBuilder(!showKitBuilder)}
            className="text-xs font-bold text-brand-600 hover:text-brand-800 transition"
          >
            {showKitBuilder ? 'Hide Customizer ▲' : 'Customize Your Kit ▼'}
          </button>
        </div>

        {/* Builder Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Step 1: Essential */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-warm-textDark uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px]">1</span>
                Choose Period Essential:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {CARE_KIT_OPTIONS.essentials.map(item => (
                  <button
                    key={`kit-ess-${item.id}`}
                    onClick={() => setKitEssential(item.id)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      kitEssential === item.id 
                        ? 'bg-rose-100/70 border-rose-400 shadow-2xs font-bold ring-2 ring-rose-200' 
                        : 'bg-white border-warm-border hover:bg-gray-50'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-warm-textDark truncate">{item.name}</p>
                      <p className="text-[11px] text-warm-textMuted font-semibold">₹{item.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Craving */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-warm-textDark uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px]">2</span>
                Choose Craving / Treat:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {CARE_KIT_OPTIONS.cravings.map(item => (
                  <button
                    key={`kit-crav-${item.id}`}
                    onClick={() => setKitCraving(item.id)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      kitCraving === item.id 
                        ? 'bg-rose-100/70 border-rose-400 shadow-2xs font-bold ring-2 ring-rose-200' 
                        : 'bg-white border-warm-border hover:bg-gray-50'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-warm-textDark truncate">{item.name}</p>
                      <p className="text-[11px] text-warm-textMuted font-semibold">₹{item.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Pain / Warmth Tool */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-warm-textDark uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px]">3</span>
                Choose Cramp Relief & Warmth Tool:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {CARE_KIT_OPTIONS.comfort.map(item => (
                  <button
                    key={`kit-comf-${item.id}`}
                    onClick={() => setKitComfort(item.id)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      kitComfort === item.id 
                        ? 'bg-rose-100/70 border-rose-400 shadow-2xs font-bold ring-2 ring-rose-200' 
                        : 'bg-white border-warm-border hover:bg-gray-50'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-warm-textDark truncate">{item.name}</p>
                      <p className="text-[11px] text-warm-textMuted font-semibold">₹{item.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Feel-Good Treat */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-warm-textDark uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px]">4</span>
                Choose Feel-Good Pamper Item:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {CARE_KIT_OPTIONS.feelGood.map(item => (
                  <button
                    key={`kit-fg-${item.id}`}
                    onClick={() => setKitFeelGood(item.id)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                      kitFeelGood === item.id 
                        ? 'bg-rose-100/70 border-rose-400 shadow-2xs font-bold ring-2 ring-rose-200' 
                        : 'bg-white border-warm-border hover:bg-gray-50'
                    }`}
                  >
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-warm-textDark truncate">{item.name}</p>
                      <p className="text-[11px] text-warm-textMuted font-semibold">₹{item.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Kit Summary Card */}
          <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-soft flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-warm-border pb-2.5">
                <h4 className="font-serif font-bold text-sm text-warm-textDark flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-rose-500" />
                  Your Assembled Kit
                </h4>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  4 Items Selected
                </span>
              </div>

              {/* Items List Preview */}
              <div className="space-y-2">
                {customKitDetails.items.map((item, idx) => (
                  <div key={`preview-item-${item.id}`} className="flex items-center justify-between text-xs">
                    <span className="text-warm-textDark truncate max-w-[180px] font-medium">
                      {idx + 1}. {item.name}
                    </span>
                    <span className="font-bold text-warm-textDark shrink-0">₹{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-dashed border-warm-border pt-3 space-y-1 text-xs">
                <div className="flex justify-between text-warm-textMuted">
                  <span>Subtotal:</span>
                  <span>₹{customKitDetails.totalPrice}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Estimated Bundle Savings:</span>
                  <span>-₹{customKitDetails.bundleSavings}</span>
                </div>
                <div className="flex justify-between font-serif font-black text-base text-warm-textDark pt-1.5 border-t border-warm-border">
                  <span>Kit Estimate:</span>
                  <span className="text-rose-600">₹{customKitDetails.finalPrice}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] text-warm-textMuted text-center font-medium">
                Choose retailer for instant cart delivery:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOrderCareKit('Blinkit')}
                  className="py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition"
                >
                  <span>Blinkit 10m</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleOrderCareKit('Zepto')}
                  className="py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition"
                >
                  <span>Zepto 10m</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => handleOrderCareKit('Amazon')}
                className="w-full py-2 px-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition"
              >
                <span>Order via Amazon Prime</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                onClick={() => {
                  setKitSavedToast(true);
                  setTimeout(() => setKitSavedToast(false), 2500);
                }}
                className="w-full py-1.5 text-center text-xs font-bold text-warm-textMuted hover:text-warm-textDark transition"
              >
                {kitSavedToast ? '✓ Saved to your profile!' : '♡ Save This Care Kit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Products Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-black text-lg sm:text-xl text-warm-textDark">
              {selectedCategory === 'all' 
                ? (onlyFavorites ? 'Your Saved Favorites' : 'All Period Care & Comfort Products')
                : MARKETPLACE_CATEGORIES.find(c => c.id === selectedCategory)?.label}
            </h3>
            <p className="text-xs text-warm-textMuted">
              Showing {filteredProducts.length} verified products with direct retailer delivery
            </p>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-warm-border p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-xl">
              🔍
            </div>
            <h4 className="font-bold text-base text-warm-textDark">No products matched your filters</h4>
            <p className="text-xs text-warm-textMuted max-w-sm mx-auto">
              Try adjusting your search query, price budget, or uncheck the instant delivery filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setBudgetFilter('all');
                setOnlyInstantDelivery(false);
                setOnlyFavorites(false);
              }}
              className="px-4 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold hover:bg-brand-600 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => {
              const isFav = favorites.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => setActiveProduct(product)}
                  className="bg-white rounded-2xl border border-warm-border p-3.5 shadow-2xs hover:shadow-soft hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-warm-cardMuted mb-3">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Badge */}
                      {product.badge && (
                        <span className="absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-brand-700 shadow-2xs">
                          {product.badge}
                        </span>
                      )}

                      {/* Instant delivery indicator */}
                      {product.quickDeliverable && (
                        <span className="absolute bottom-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-black/75 text-amber-300 backdrop-blur-xs flex items-center gap-1 shadow-2xs">
                          <Clock className="w-2.5 h-2.5" />
                          10-15 Min
                        </span>
                      )}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-warm-textMuted hover:text-rose-500 shadow-2xs transition"
                        aria-label="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-[11px] text-warm-textMuted mb-1">
                      <span className="font-bold text-brand-600">{product.brand}</span>
                      <span className="flex items-center gap-0.5 font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                        <span className="text-warm-textMuted font-normal text-[10px]">({product.reviewsCount})</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-xs sm:text-sm text-warm-textDark line-clamp-2 leading-snug group-hover:text-brand-600 transition">
                      {product.name}
                    </h4>

                    {/* Cycle Benefit */}
                    <p className="text-[11px] text-warm-textMuted mt-1.5 line-clamp-2 leading-relaxed">
                      {product.cycleBenefit}
                    </p>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="mt-4 pt-3 border-t border-warm-border flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif font-black text-base text-warm-textDark">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-warm-textMuted line-through">
                          ₹{product.mrp}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600">
                        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRetailerModalProduct(product);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition transform active:scale-95"
                    >
                      <span>Shop Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Product Detail Modal */}
      {activeProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative space-y-4">
            {/* Close button */}
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-warm-cardMuted hover:bg-gray-200 text-warm-textDark transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Image Preview */}
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-warm-cardMuted">
              <img 
                src={activeProduct.image} 
                alt={activeProduct.name} 
                className="w-full h-full object-cover"
              />
              {activeProduct.badge && (
                <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-white/95 text-brand-700 shadow-2xs">
                  {activeProduct.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-warm-textMuted">
                <span className="font-bold text-brand-600 uppercase tracking-wider">{activeProduct.brand}</span>
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {activeProduct.rating} ({activeProduct.reviewsCount} reviews)
                </span>
              </div>

              <h3 className="font-serif font-black text-lg text-warm-textDark leading-snug">
                {activeProduct.name}
              </h3>

              <div className="flex items-baseline gap-2">
                <span className="font-serif font-black text-2xl text-warm-textDark">₹{activeProduct.price}</span>
                <span className="text-sm text-warm-textMuted line-through">₹{activeProduct.mrp}</span>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Save ₹{activeProduct.mrp - activeProduct.price}
                </span>
              </div>
            </div>

            {/* Why It Helps In Your Cycle */}
            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3.5 text-xs text-warm-textDark space-y-1">
              <span className="font-bold text-rose-700 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-100" />
                Why it helps during your cycle
              </span>
              <p className="leading-relaxed text-warm-textDark/90">
                {activeProduct.cycleBenefit}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs text-warm-textMuted leading-relaxed">
              <h4 className="font-bold text-warm-textDark text-[11px] uppercase tracking-wider">Product Highlights</h4>
              <p>{activeProduct.description}</p>
            </div>

            {/* Specifications */}
            <div className="flex flex-wrap gap-1.5">
              {activeProduct.specs.map((spec, i) => (
                <span key={i} className="text-[11px] bg-warm-cardMuted border border-warm-border text-warm-textDark font-medium px-2.5 py-1 rounded-xl">
                  {spec}
                </span>
              ))}
            </div>

            {/* Retailer Links */}
            <div className="space-y-2 pt-2 border-t border-warm-border">
              <h4 className="font-bold text-xs text-warm-textDark">Order from official retailer partners:</h4>
              <div className="grid grid-cols-2 gap-2">
                {activeProduct.retailers.map(ret => (
                  <a
                    key={ret.name}
                    href={ret.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition ${ret.color}`}
                  >
                    <div>
                      <span className="font-bold text-xs block">{ret.name}</span>
                      <span className="text-[10px] opacity-80 block">{ret.badge}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-warm-textMuted text-center">
              Verified retailer link • Checkout is completed securely on partner store
            </p>
          </div>
        </div>
      )}

      {/* 8. Retailer Quick Store Selector Modal */}
      {retailerModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setRetailerModalProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-warm-cardMuted hover:bg-gray-200 text-warm-textDark transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-warm-border pb-3">
              <img 
                src={retailerModalProduct.image} 
                alt={retailerModalProduct.name}
                className="w-12 h-12 rounded-xl object-cover" 
              />
              <div className="min-w-0 pr-6">
                <h3 className="font-bold text-xs sm:text-sm text-warm-textDark truncate">
                  {retailerModalProduct.name}
                </h3>
                <p className="text-xs font-serif font-black text-rose-600">
                  ₹{retailerModalProduct.price} <span className="text-warm-textMuted line-through font-normal text-[11px]">₹{retailerModalProduct.mrp}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-warm-textDark">
                Select your preferred delivery platform:
              </p>

              <div className="space-y-2">
                {retailerModalProduct.retailers.map(ret => (
                  <a
                    key={`quick-${ret.name}`}
                    href={ret.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setRetailerModalProduct(null)}
                    className="w-full p-3 rounded-2xl border border-warm-border hover:border-brand-400 bg-white hover:bg-rose-50/50 flex items-center justify-between transition group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-warm-cardMuted flex items-center justify-center font-bold text-xs text-warm-textDark">
                        {ret.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-warm-textDark group-hover:text-brand-600 transition">
                            {ret.name}
                          </h4>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                            {ret.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-warm-textMuted">{ret.deliveryTime}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-warm-textMuted group-hover:text-brand-600 shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-warm-cardMuted rounded-xl p-3 text-[10px] text-warm-textMuted leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                HER LIFE provides verified product & retailer queries. Tapping opens the official retailer app or site for final delivery address verification and payment.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 9. City / Delivery Location Modal */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowCityModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-warm-cardMuted hover:bg-gray-200 text-warm-textDark transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              <h3 className="font-serif font-bold text-base text-warm-textDark">
                Set Delivery Location
              </h3>
            </div>

            <p className="text-xs text-warm-textMuted">
              Select your city to check 10-15 minute instant delivery availability on Blinkit, Zepto & Flipkart Minutes.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad'].map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setUserCity(city);
                    try { localStorage.setItem(USER_CITY_KEY, city); } catch {}
                    setShowCityModal(false);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                    userCity === city
                      ? 'bg-brand-500 text-white border-brand-500 shadow-2xs'
                      : 'bg-white hover:bg-warm-cardMuted border-warm-border text-warm-textDark'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      () => {
                        setUserCity('Detected (Current Location)');
                        try { localStorage.setItem(USER_CITY_KEY, 'Current Location'); } catch {}
                        setShowCityModal(false);
                      },
                      () => {
                        setShowCityModal(false);
                      }
                    );
                  } else {
                    setShowCityModal(false);
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-warm-border bg-warm-cardMuted hover:bg-gray-200 font-bold text-xs text-warm-textDark flex items-center justify-center gap-1.5 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>Use My Exact GPS Location</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
