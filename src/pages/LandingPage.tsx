import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Shield, ArrowRight, Bed, Building2, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePublicProperties } from '@/hooks/usePublicData';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ParticleBackground from '@/components/ui/particle-background';
import GradientCard from '@/components/ui/gradient-card';

const CITIES = [
  { name: 'Bangalore', tagline: '300+ PGs', active: true },
  { name: 'Hyderabad', tagline: 'Coming Soon', active: false },
  { name: 'Pune', tagline: 'Coming Soon', active: false },
  { name: 'Delhi NCR', tagline: 'Coming Soon', active: false },
  { name: 'Chennai', tagline: 'Coming Soon', active: false },
];

const POPULAR_AREAS = ['Marathahalli', 'Whitefield', 'Koramangala', 'BTM Layout', 'HSR Layout', 'Electronic City', 'Bellandur', 'Indiranagar', 'Sarjapur Road'];

const STATS = [
  { value: '300+', label: 'Verified Properties', icon: <Building2 size={20} />, gradient: 'purple' },
  { value: '5,000+', label: 'Happy Residents', icon: <Users size={20} />, gradient: 'blue' },
  { value: '12', label: 'Bangalore Areas', icon: <MapPin size={20} />, gradient: 'green' },
  { value: '4.6', label: 'Average Rating', icon: <Star size={20} />, gradient: 'orange' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: featured } = usePublicProperties({ city: 'Bangalore', limit: 6 });

  const getAvailableBeds = (property: any) => {
    if (!property.rooms) return 0;
    return property.rooms.reduce((sum: number, room: any) => {
      if (!room.beds) return sum;
      return sum + room.beds.filter((b: any) => b.status === 'vacant').length;
    }, 0);
  };

  const getRentRange = (property: any) => {
    if (!property.rooms?.length) return property.price_range || '—';
    const rents = property.rooms.map((r: any) => r.rent_per_bed || r.expected_rent).filter(Boolean);
    if (!rents.length) return property.price_range || '—';
    const min = Math.min(...rents);
    return `₹${min.toLocaleString()}`;
  };

  const handleSearch = () => {
    navigate(`/explore${searchQuery ? `?area=${searchQuery}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-semibold text-lg tracking-tight text-foreground">Gharpayy</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <button onClick={() => navigate('/explore')} className="hover:text-foreground transition-colors font-medium">Explore PGs</button>
              <button onClick={() => navigate('/owner-portal')} className="hover:text-foreground transition-colors">For Owners</button>
              <button onClick={() => navigate('/explore')} className="hover:text-foreground transition-colors">About</button>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Login</Button>
              <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25" onClick={() => navigate('/explore')}>
                Find a PG
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 sm:pt-28 lg:pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  Now live in Bangalore · 300+ properties
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
              >
                Your next home,<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
                  found in minutes.
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed"
              >
                Discover verified PG accommodations across Bangalore. Transparent pricing, instant booking, zero brokerage. Experience the future of student and working professional housing.
              </motion.p>
            </motion.div>

            {/* Search */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative flex flex-col sm:flex-row gap-3 max-w-xl">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      placeholder="Search by area or tech park..."
                      className="pl-12 h-14 text-base rounded-xl bg-background/95 backdrop-blur-sm border-2 focus:border-indigo-500/50 shadow-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button 
                    onClick={handleSearch} 
                    className="h-14 px-8 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105"
                  >
                    Search <ArrowRight size={20} className="ml-2" />
                  </Button>
                </div>
              </div>

              {/* Quick areas */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="text-xs text-muted-foreground self-center mr-1">Popular:</span>
                {POPULAR_AREAS.slice(0, 6).map(area => (
                  <button
                    key={area}
                    onClick={() => navigate(`/explore?area=${area}`)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-secondary to-muted hover:from-indigo-500/10 hover:to-purple-500/10 hover:border-indigo-500/30 border border-transparent transition-all duration-300 hover:scale-105"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </section>

      {/* Stats */}
      <section className="relative py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <GradientCard gradient={stat.gradient as any} className="p-6 hover:scale-105 transition-transform duration-300">
                  <div className="flex justify-center mb-3 text-foreground/50">
                    {stat.icon}
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">{stat.label}</p>
                </GradientCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
                Featured <span className="text-indigo-500">properties</span>
              </h2>
              <p className="text-sm text-muted-foreground">Hand-picked PGs in top Bangalore neighborhoods</p>
            </div>
            <Button variant="ghost" className="gap-2 text-sm" onClick={() => navigate('/explore')}>
              View all <ChevronRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured?.slice(0, 6).map((property: any, i: number) => {
              const beds = getAvailableBeds(property);
              const startingRent = getRentRange(property);
              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 group-hover:-translate-y-1">
                    <div className="relative aspect-[4/3] bg-muted/50 overflow-hidden">
                      {property.photos?.length > 0 ? (
                        <img src={property.photos[0]} alt={property.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Bed size={48} className="text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {(property as any).is_verified && (
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium flex items-center gap-1.5 shadow-lg">
                          <Shield size={12} className="text-success" /> Verified
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium shadow-lg">
                        {beds > 0 ? `${beds} beds available` : 'Full'}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-indigo-500 transition-colors">{property.name}</h3>
                        {(property as any).rating && (
                          <div className="flex items-center gap-1 shrink-0">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold">{(property as any).rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <MapPin size={12} />
                        <span>{[property.area, property.city].filter(Boolean).join(', ')}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-foreground">From {startingRent}</span>
                        <span className="text-xs text-muted-foreground">/month</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">Explore by city</h2>
            <p className="text-sm text-muted-foreground">Starting with Bangalore, expanding across India</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CITIES.map((city, i) => (
              <motion.button
                key={city.name}
                onClick={() => city.active && navigate('/explore')}
                disabled={!city.active}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border text-left transition-all duration-300 ${
                  city.active
                    ? 'bg-card border-border hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer group'
                    : 'bg-muted/30 border-border/30 cursor-not-allowed opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${city.active ? 'bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors' : 'bg-muted/50 text-muted-foreground'}`}>
                  <MapPin size={24} />
                </div>
                <h3 className="font-bold text-base mb-1">{city.name}</h3>
                <p className="text-xs text-muted-foreground">{city.tagline}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">How Gharpayy works</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">Simple, transparent, and designed for you</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Search & Discover', desc: 'Browse verified PGs by area, budget, and preferences. Every listing is real and up-to-date.', gradient: 'from-blue-500 to-cyan-500' },
              { step: '02', title: 'Tour & Compare', desc: 'Schedule visits or take virtual tours. Compare rooms, amenities, and prices side by side.', gradient: 'from-purple-500 to-pink-500' },
              { step: '03', title: 'Book Instantly', desc: 'Reserve your bed with just ₹1,000. Zero brokerage, transparent pricing, instant confirmation.', gradient: 'from-indigo-500 to-purple-600' },
            ].map((item, i) => (
              <motion.div 
                key={item.step} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-20 transition duration-500 group-hover:opacity-40`} />
                <div className="relative p-8 rounded-2xl bg-card border border-border/50 hover:border-indigo-500/30 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20`}>
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 sm:p-16 text-center shadow-2xl shadow-indigo-500/20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to find your new home?</h2>
            <p className="text-indigo-100 mb-10 max-w-md mx-auto text-lg">Join 5,000+ residents who found their perfect PG through Gharpayy. Experience the future of housing today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/explore')} 
                className="h-14 px-10 bg-white text-indigo-600 hover:bg-indigo-50 text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Explore PGs <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/capture')} 
                className="h-14 px-10 text-white border-white/30 hover:bg-white/10 hover:border-white/50 text-lg rounded-xl transition-all"
              >
                List Your Property
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-semibold text-base">Gharpayy</span>
              <span className="text-xs text-muted-foreground">· India's smartest PG platform</span>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 Gharpayy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
