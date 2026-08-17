import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HatGlasses, 
  ShieldCheck, 
  Tag, 
  UserRound, 
  BookOpenText, 
  NotebookText, 
  CircuitBoard, 
  PencilRuler, 
  Mail, 
  ArrowRight,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Image as ImageIcon,
  DollarSign,
  Store
} from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: <HatGlasses size={22} strokeWidth={1} className="text-[#ff4569]" />,
      title: "Verified Campus Peer Network",
      description: "Trade directly with students from your own college campus. Every seller profile displays their verified college, department, and semester."
    },
    {
      icon: <Tag size={22} strokeWidth={1} className="text-[#ff4569]" />,
      title: "Zero Middleman Fees",
      description: "No hidden listing or transaction fees. Buy and sell textbooks, electronics, and dorm gear directly with 100% peer transparency."
    },
    {
      icon: <ShieldCheck size={22} strokeWidth={1} className="text-[#ff4569]" />,
      title: "Instant Inspection & Handshake",
      description: "Never worry about fraud. Meet up safely at campus libraries or student centers to inspect items in person before completing any exchange."
    },
    {
      icon: <CircuitBoard size={22} strokeWidth={1} className="text-[#ff4569]" />,
      title: "Instant Cart & Wishlist Sync",
      description: "Save items for later in your wishlist or reserve items directly in your cart with real-time state synchronization across all devices."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "List Your Items Easily",
      description: "Use our dedicated Sell Item form to upload photos, set your price, tag condition, and specify your department details.",
      icon: <Tag size={20} strokeWidth={1} className="text-[#ff4569]" />
    },
    {
      number: "02",
      title: "Direct Peer Connection",
      description: "View full seller details, college credentials, department, and semester info. Contact sellers directly via instant phone call or email.",
      icon: <UserRound size={20} strokeWidth={1} className="text-[#ff4569]" />
    },
    {
      number: "03",
      title: "Safe Campus Pickup",
      description: "Arrange a quick meetup at your campus library or student center to inspect the item in hand and complete the exchange.",
      icon: <ShieldCheck size={20} strokeWidth={1} className="text-[#ff4569]" />
    }
  ];

  return (
    <section className="bg-[#050508] py-20 px-6 md:px-16 border-t border-gray-800/80 relative overflow-hidden select-none">
      
      {/* Background Subtle Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#D5354F]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col gap-20 relative z-10">
        
        {/* Section 1: About Overview Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Built Exclusively For <span className="text-[#D5354F]">Campus Students</span>
          </h2>

          <p className="text-sm md:text-base text-[#B89AA2] font-light leading-relaxed">
            CampusCart is the ultimate student-to-student marketplace designed to make buying, selling, and reusing academic books, tech gear, and campus essentials effortless, affordable, and safe.
          </p>
        </div>

        {/* Section 2: Dedicated "Sell Your Item" Feature Banner */}
        <div className="bg-gradient-to-r from-[#12131b] via-[#0c0d12] to-[#181115] border border-gray-800 hover:border-[#ff4569]/50 rounded-[36px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group transition-all duration-300">
          
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff4569]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col gap-5 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 bg-[#ff4569]/10 border border-[#ff4569]/30 text-[#ff4569] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider w-fit">
              <Store size={14} strokeWidth={1.5} /> Verified Student Resale Hub
            </div>

            <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">
              Have Unused Books or Gear? <span className="text-[#ff4569]">Sell It On Campus!</span>
            </h3>

            <p className="text-sm text-[#B89AA2] font-light leading-relaxed">
              Don't let your previous semester books, drafter kits, scientific calculators, or hoodies sit idle. Our seamless **Sell Item** portal lets you create a professional listing in under 60 seconds with instant live preview.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-200">
                <CheckCircle2 size={16} strokeWidth={1.5} className="text-[#ff4569] flex-shrink-0" />
                <span>Upload Photos or Image URLs</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-200">
                <CheckCircle2 size={16} strokeWidth={1.5} className="text-[#ff4569] flex-shrink-0" />
                <span>Set Price & Select Condition</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-200">
                <CheckCircle2 size={16} strokeWidth={1.5} className="text-[#ff4569] flex-shrink-0" />
                <span>Auto-populates College & Department</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-200">
                <CheckCircle2 size={16} strokeWidth={1.5} className="text-[#ff4569] flex-shrink-0" />
                <span>100% Free - 0 Commission Fees</span>
              </div>
            </div>

            <div className="pt-3">
              <Link 
                to="/addproduct" 
                className="bg-[#D5354F] hover:bg-[#ff4569] text-white px-7 py-3.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-[#D5354F]/25 hover:shadow-[#ff4569]/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Tag size={16} strokeWidth={1} />
                <span>Sell an Item Now</span>
                <ArrowRight size={16} strokeWidth={1} />
              </Link>
            </div>
          </div>

          {/* Graphical Card Visual Representation */}
          <div className="w-full lg:w-[380px] bg-[#161822]/90 border border-white/10 rounded-3xl p-5 flex flex-col gap-4 shadow-2xl relative z-10 group-hover:border-[#ff4569]/40 transition-all">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Tag size={14} className="text-[#ff4569]" /> Live Listing Portal
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full">
                Instant Publish
              </span>
            </div>

            <div className="h-40 rounded-2xl bg-[#0e1015] border border-white/5 flex flex-col items-center justify-center gap-2 text-gray-400">
              <ImageIcon size={32} strokeWidth={1} className="text-[#ff4569]" />
              <span className="text-xs font-medium">Multiple Image Upload Support</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-gray-400">Listing Category:</span>
              <span className="text-white font-bold bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                Books / Electronics / Gear
              </span>
            </div>
          </div>

        </div>

        {/* Section 3: Core Feature Cards Grid (Footer Icon Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[#0c0d12]/90 border border-gray-800 hover:border-[#ff4569] rounded-3xl p-6 flex flex-col gap-4 shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl border border-gray-700 p-2.5 flex items-center justify-center group-hover:border-[#ff4569] group-hover:bg-[#ff4569]/10 transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white leading-snug group-hover:text-[#ff4569] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#B89AA2] font-light leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Section 4: How It Works Steps */}
        <div className="bg-[#0c0d12]/95 border border-gray-800 rounded-[36px] p-8 md:p-12 flex flex-col gap-10 shadow-2xl relative">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800/80 pb-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#D5354F] uppercase tracking-widest">
                Simple & Transparent Flow
              </span>
              <h3 className="text-2xl md:text-4xl font-black text-white">
                How CampusCart Works
              </h3>
            </div>
            <Link 
              to="/marketplace" 
              className="text-xs font-semibold text-[#ff4569] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              Start Exploring Now <ArrowRight size={16} strokeWidth={1} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-[#D5354F]/40 group-hover:text-[#ff4569] transition-colors">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl border border-gray-700 p-2 flex items-center justify-center group-hover:border-[#ff4569] group-hover:bg-[#ff4569]/10 transition-all duration-300">
                    {step.icon}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-[#B89AA2] font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Live Platform Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0c0d12] border border-gray-800 rounded-3xl p-6 md:p-8 text-center">
          <div className="flex flex-col gap-1 border-r border-gray-800/80 last:border-none">
            <span className="text-2xl md:text-3xl font-black text-white">100%</span>
            <span className="text-xs text-[#B89AA2]">Verified Peers</span>
          </div>
          <div className="flex flex-col gap-1 border-r border-gray-800/80 last:border-none">
            <span className="text-2xl md:text-3xl font-black text-[#D5354F]">₹0</span>
            <span className="text-xs text-[#B89AA2]">Middleman Fees</span>
          </div>
          <div className="flex flex-col gap-1 border-r border-gray-800/80 last:border-none">
            <span className="text-2xl md:text-3xl font-black text-white">Direct</span>
            <span className="text-xs text-[#B89AA2]">Campus Handshake</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl md:text-3xl font-black text-[#D5354F]">Instant</span>
            <span className="text-xs text-[#B89AA2]">Cart & Wishlist</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
