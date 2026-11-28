import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Clock, 
  RotateCcw, 
  Check, 
  Scale, 
  ChevronRight, 
  ShieldCheck, 
  Star, 
  Gamepad2, 
  Camera, 
  BatteryCharging, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const fmt = n => 'Rs. ' + (Number(n) || 0).toLocaleString('en-PK');

const STARTER_PROMPTS = [
  {
    id: 'gaming',
    icon: Gamepad2,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    title: 'Best for Gaming & PUBG',
    desc: 'High FPS · 120Hz AMOLED · Liquid Cooling',
  },
  {
    id: 'camera',
    icon: Camera,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-50',
    title: 'Best Camera Phones',
    desc: 'Studio Portraits · 4K 60fps · OIS Stabilization',
  },
  {
    id: 'battery',
    icon: BatteryCharging,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    title: 'All-Day Battery Life',
    desc: '5000mAh+ · Fast Charging · Long Durability',
  },
  {
    id: 'compare',
    icon: Scale,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
    title: 'Compare Top 2 Devices',
    desc: 'Automatic side-by-side specs, condition & price',
  },
];

const BUDGET_OPTIONS = [
  { label: 'Under Rs. 40,000', min: 0, max: 40000 },
  { label: 'Rs. 40,000 - 80,000', min: 40000, max: 80000 },
  { label: 'Rs. 80,000 - 150,000', min: 80000, max: 150000 },
  { label: 'Above Rs. 150,000', min: 150000, max: 2000000 },
];

const CONDITION_OPTIONS = [
  { label: 'Brand New (Box Pack Sealed)', value: 'new' },
  { label: 'Used / Mint Condition', value: 'used' },
  { label: 'Either (Best Value Option)', value: 'any' },
];

export default function SmartAssistantModal({ isOpen, onClose, onProduct, onShop }) {
  const { products = [], shops = [], currentUser } = useApp();

  const [mode, setMode] = useState('chat'); // 'chat' | 'voice'
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(null);
  const [comparisonItems, setComparisonItems] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto scroll as conversation progresses
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, comparisonItems]);

  if (!isOpen) return null;

  // Filter only phones (exclude cases/covers/chargers)
  const phoneList = products.filter(p => {
    const isAccessory = ['cases', 'covers', 'airpods', 'smartwatch', 'chargers', 'headphones', 'handsfree', 'cables'].includes(p.category) ||
      ['case', 'cover', 'glass', 'protector', 'charger', 'buds', 'watch', 'handsfree', 'cable'].some(kw => (p.name || '').toLowerCase().includes(kw));
    return !isAccessory;
  });

  // Smart Matching Core Engine
  const calculateMatches = (goalId, budgetBracket, conditionPref = 'any') => {
    const filtered = phoneList.filter(p => {
      if (budgetBracket && (p.price < budgetBracket.min || p.price > budgetBracket.max)) return false;
      if (conditionPref === 'new' && (p.usedDetails || p.condition === 'used')) return false;
      if (conditionPref === 'used' && !p.usedDetails && p.condition !== 'used') return false;
      return true;
    });

    const scored = filtered.map(p => {
      let score = 50;
      const name = (p.name || '').toLowerCase();
      const specs = p.specs || {};
      const specsStr = JSON.stringify(specs).toLowerCase();

      if (goalId === 'gaming') {
        if (specsStr.includes('snapdragon') || specsStr.includes('dimensity') || specsStr.includes('bionic')) score += 25;
        if (specsStr.includes('120hz') || specsStr.includes('amoled')) score += 20;
        if (specs.RAM && (specs.RAM.includes('8') || specs.RAM.includes('12') || specs.RAM.includes('16'))) score += 15;
      } else if (goalId === 'camera') {
        if (name.includes('iphone') || name.includes('pixel') || name.includes('ultra') || name.includes('pro')) score += 30;
        if (specsStr.includes('ois') || specsStr.includes('200mp') || specsStr.includes('50mp')) score += 25;
      } else if (goalId === 'battery') {
        if (specs.Battery && (specs.Battery.includes('5000') || specs.Battery.includes('6000'))) score += 30;
        if (specsStr.includes('fast') || specsStr.includes('67w')) score += 15;
      } else {
        if (name.includes('iphone 15') || name.includes('s24') || name.includes('ultra')) score += 30;
      }

      const shop = shops.find(s => s.id === p.shopId);
      if (shop?.verified) score += 10;

      return { product: p, score, shop };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4);
  };

  // Step 1: User selects one of the 4 starter cards
  const handleSelectStarter = (starter) => {
    setCurrentGoal(starter);
    setMessages([
      {
        id: 'msg-start-user',
        sender: 'user',
        text: starter.title,
      },
      {
        id: 'msg-ask-budget',
        sender: 'bot',
        text: `Great choice! To find the best available devices in Bahawalnagar for "${starter.title}", what is your target budget?`,
        type: 'question-budget',
      }
    ]);
  };

  // Step 2: User selects budget option
  const handleSelectBudget = (budget) => {
    setCurrentBudget(budget);
    setMessages(prev => [
      ...prev,
      {
        id: `msg-budget-user-${Date.now()}`,
        sender: 'user',
        text: budget.label,
      },
      {
        id: `msg-ask-cond-${Date.now()}`,
        sender: 'bot',
        text: `Got it! Do you prefer Brand New (Box Pack Sealed) or Verified Clean Used?`,
        type: 'question-condition',
        budget,
      }
    ]);
  };

  // Step 3: User selects condition preference -> renders Top 4 Recommendations
  const handleSelectCondition = (condOption) => {
    const results = calculateMatches(currentGoal?.id || 'gaming', currentBudget, condOption.value);

    setMessages(prev => [
      ...prev,
      {
        id: `msg-cond-user-${Date.now()}`,
        sender: 'user',
        text: condOption.label,
      },
      {
        id: `msg-results-${Date.now()}`,
        sender: 'bot',
        text: `Here are the top 4 best matching devices available in Bahawalnagar shops right now:`,
        type: 'results',
        recommendations: results,
      }
    ]);
  };

  // User types free-form query in the bottom input
  const handleSendQuery = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim();
    const queryLower = query.toLowerCase();
    setInputValue('');

    // Parse budget if mentioned
    let matchedBudget = null;
    if (queryLower.includes('under 40') || queryLower.includes('under 40k')) matchedBudget = BUDGET_OPTIONS[0];
    else if (queryLower.includes('50k') || queryLower.includes('60k') || queryLower.includes('70k') || queryLower.includes('80k')) matchedBudget = BUDGET_OPTIONS[1];
    else if (queryLower.includes('1 lakh') || queryLower.includes('100k') || queryLower.includes('150k')) matchedBudget = BUDGET_OPTIONS[2];
    else if (queryLower.includes('iphone') || queryLower.includes('s25') || queryLower.includes('flagship')) matchedBudget = BUDGET_OPTIONS[3];

    let goal = 'gaming';
    if (queryLower.includes('camera') || queryLower.includes('photo')) goal = 'camera';
    else if (queryLower.includes('battery') || queryLower.includes('backup')) goal = 'battery';

    const results = calculateMatches(goal, matchedBudget || BUDGET_OPTIONS[1], 'any');

    setMessages(prev => [
      ...prev,
      {
        id: `msg-user-q-${Date.now()}`,
        sender: 'user',
        text: query,
      },
      {
        id: `msg-bot-q-${Date.now()}`,
        sender: 'bot',
        text: `I analyzed available stock across Bahawalnagar retailers for "${query}". Here are the top recommended options:`,
        type: 'results',
        recommendations: results,
      }
    ]);
  };

  const handleStartComparison = (recs) => {
    if (recs && recs.length >= 2) {
      setComparisonItems(recs.slice(0, 2));
    }
  };

  const handleResetConversation = () => {
    setMessages([]);
    setCurrentGoal(null);
    setCurrentBudget(null);
    setComparisonItems(null);
  };

  const greetingName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Shopper';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-md h-full sm:h-[88vh] bg-gradient-to-b from-white via-[#8586f2]/5 to-[#8586f2]/10 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Top Header Matching Reference Image ── */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between flex-shrink-0 z-30">
          {/* Close Button on left */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-gray-200/80 shadow-2xs flex items-center justify-center text-gray-700 active:scale-95 transition-transform"
            aria-label="Close"
          >
            <X size={17} />
          </button>

          {/* Centered Pill Toggle: Chat | Voice */}
          <div className="bg-gray-100/90 border border-gray-200/70 p-1 rounded-full flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => setMode('chat')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'chat'
                  ? 'bg-white text-black shadow-xs font-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <span>💬 Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('voice')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'voice'
                  ? 'bg-[#8586f2] text-white shadow-xs font-black'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <span>🎙️ Voice</span>
            </button>
          </div>

          {/* Reset / History icon on right */}
          <button
            onClick={handleResetConversation}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-gray-200/80 shadow-2xs flex items-center justify-center text-gray-700 active:scale-95 transition-transform"
            title="Start New Recommendation"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-3 space-y-4 pb-28 smooth-scroll">
          {/* Hero Greeting Section (When conversation just started) */}
          {messages.length === 0 ? (
            <div className="space-y-5 animate-in fade-in duration-200 pt-1">
              <div className="text-center pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8586f2]/10 text-[#8586f2] text-xs font-bold mb-2">
                  <Sparkles size={13} />
                  <span>Salam! Good afternoon, {greetingName}</span>
                </div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                  How can I help?
                </h1>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Find or compare the best phones available across Bahawalnagar shops.
                </p>
              </div>

              {/* 2x2 Grid of 4 Starter Cards (Exact Match of Reference Image) */}
              <div className="grid grid-cols-2 gap-3">
                {STARTER_PROMPTS.map(starter => {
                  const Icon = starter.icon;
                  return (
                    <button
                      key={starter.id}
                      type="button"
                      onClick={() => handleSelectStarter(starter)}
                      className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-4 text-left shadow-xs hover:border-[#8586f2]/50 active:scale-98 transition-all flex flex-col justify-between min-h-[120px] group"
                    >
                      <div className={`w-9 h-9 rounded-xl ${starter.bgColor} ${starter.iconColor} flex items-center justify-center shadow-2xs mb-2 group-hover:scale-105 transition-transform`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-gray-900 leading-snug group-hover:text-[#8586f2] transition-colors">
                          {starter.title}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5 line-clamp-2 leading-relaxed">
                          {starter.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Status Note */}
              <div className="text-center pt-4">
                <p className="text-[11px] text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                  I'm your Bahawal Market Smart Assistant. Instant answers powered by live inventory.
                </p>
              </div>
            </div>
          ) : (
            /* Conversational Flow right on the screen (No disruptive popups) */
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';

                return (
                  <div key={msg.id} className="space-y-2">
                    {/* Message Bubble */}
                    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[#8586f2] text-white font-medium rounded-br-xs'
                            : 'bg-white text-gray-900 border border-gray-200/90 rounded-bl-xs font-normal'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>

                    {/* Step 2 Inline Question: Budget Options */}
                    {msg.type === 'question-budget' && (
                      <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in slide-in-from-bottom-2">
                        {BUDGET_OPTIONS.map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => handleSelectBudget(opt)}
                            className="bg-white border border-[#8586f2]/30 hover:border-[#8586f2] text-gray-800 hover:text-[#8586f2] p-2.5 rounded-xl text-xs font-bold text-center active:scale-95 transition-all shadow-2xs"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Step 3 Inline Question: Condition Options */}
                    {msg.type === 'question-condition' && (
                      <div className="flex flex-col gap-1.5 pt-1 animate-in fade-in slide-in-from-bottom-2">
                        {CONDITION_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelectCondition(opt)}
                            className="bg-white border border-[#8586f2]/30 hover:border-[#8586f2] text-gray-800 hover:text-[#8586f2] p-2.5 rounded-xl text-xs font-bold text-left active:scale-95 transition-all shadow-2xs flex items-center justify-between"
                          >
                            <span>{opt.label}</span>
                            <ChevronRight size={14} className="text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Step 4: Top 4 Recommended Cards */}
                    {msg.type === 'results' && msg.recommendations && (
                      <div className="space-y-3 pt-2">
                        {/* Compare Button if at least 2 items */}
                        {msg.recommendations.length >= 2 && (
                          <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-gray-200">
                            <span className="text-[11px] font-bold text-gray-700">
                              Top 4 Recommended for You:
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartComparison(msg.recommendations)}
                              className="px-2.5 py-1 bg-[#8586f2] text-white text-[10.5px] font-bold rounded-lg active:scale-95 transition-transform flex items-center gap-1"
                            >
                              <Scale size={12} />
                              <span>Compare Top 2</span>
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2.5">
                          {msg.recommendations.map(({ product, shop, score }) => (
                            <div
                              key={product.id}
                              className="bg-white rounded-2xl border border-gray-200 p-3 shadow-xs flex flex-col justify-between cursor-pointer active:scale-98 transition-transform"
                              onClick={() => {
                                onClose();
                                if (onProduct) onProduct(product.id);
                              }}
                            >
                              <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden p-2 flex items-center justify-center mb-2">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>

                              <div>
                                <span className="text-[9.5px] font-bold bg-[#8586f2]/10 text-[#8586f2] px-1.5 py-0.2 rounded-md">
                                  {score}% Match
                                </span>
                                <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 mt-1">
                                  {product.name}
                                </h4>
                                <p className="text-[10.5px] text-gray-400 font-medium truncate mt-0.5">
                                  {shop?.name || 'Bahawal Market'}
                                </p>
                              </div>

                              <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-black text-[#8586f2]">
                                  {fmt(product.price)}
                                </span>
                                <span className="text-[10px] font-bold text-gray-700 hover:text-[#8586f2]">
                                  View →
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Side-by-Side Comparison Matrix (if Compare Top 2 is clicked) */}
              {comparisonItems && (
                <div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm space-y-3 mt-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs font-black text-gray-900 flex items-center gap-1">
                      <Scale size={14} className="text-[#8586f2]" />
                      <span>Side-by-Side Device Comparison</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setComparisonItems(null)}
                      className="text-gray-400 hover:text-black"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    {comparisonItems.map(({ product, shop }, i) => (
                      <div key={product.id} className="p-2 bg-gray-50 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Option {i + 1}</span>
                        <p className="text-xs font-black text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs font-black text-[#8586f2]">{fmt(product.price)}</p>
                        <p className="text-[10px] text-emerald-600 font-bold">
                          {product.condition === 'new' ? 'Box Pack Sealed' : `Used (${product.usedDetails?.conditionRating || '9/10'})`}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">{shop?.name}</p>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            if (onProduct) onProduct(product.id);
                          }}
                          className="w-full mt-2 py-1 bg-[#8586f2] text-white text-[10.5px] font-bold rounded-lg"
                        >
                          Select This
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Bottom Input Pill (Matching Exact Reference Image) ── */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent z-30 pb-safe">
          <form onSubmit={handleSendQuery} className="flex items-center gap-2">
            <div className="flex-1 bg-white border border-gray-300/80 rounded-full px-4 py-3 flex items-center gap-2 shadow-xs focus-within:border-[#8586f2] transition-colors">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask anything... (e.g. best phone under 80k)"
                className="w-full bg-transparent text-xs text-black placeholder:text-gray-400 focus:outline-none font-medium"
              />
            </div>

            {/* Mic / Send Action Button styled in our brand purple */}
            <button
              type={inputValue.trim() ? 'submit' : 'button'}
              onClick={inputValue.trim() ? handleSendQuery : () => setIsVoiceActive(prev => !prev)}
              className="w-11 h-11 rounded-full bg-[#8586f2] hover:bg-[#7375e8] text-white flex items-center justify-center active:scale-95 transition-transform shadow-md shadow-[#8586f2]/25 flex-shrink-0"
              aria-label={inputValue.trim() ? 'Send' : 'Voice Input'}
            >
              {inputValue.trim() ? (
                <Send size={17} />
              ) : isVoiceActive ? (
                <MicOff size={18} className="animate-pulse text-amber-200" />
              ) : (
                <Mic size={18} />
              )}
            </button>
          </form>

          {isVoiceActive && (
            <p className="text-[10.5px] text-center text-[#8586f2] font-semibold mt-1 animate-pulse">
              Listening... Speak your budget or preferred model
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
