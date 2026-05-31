"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ShoppingCart, Trash2, ShieldCheck, Tag, CreditCard,
  ChevronRight, Lock, CheckCircle2, RefreshCw, Sparkles, HelpCircle
} from "lucide-react";
import { useCartStore, LicenseTier } from "@/store/useCartStore";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateTier,
    getCartTotal,
    clearCart
  } = useCartStore();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Checkout phases: "cart" | "checkout" | "processing" | "success"
  const [phase, setPhase] = useState<"cart" | "checkout" | "processing" | "success">("cart");

  // Payment inputs
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const handleApplyPromo = () => {
    setPromoError(false);
    const code = promoCode.trim().toUpperCase();
    if (code === "TN20" || code === "CREATOR20") {
      setPromoApplied(true);
      setDiscountAmount(getCartTotal() * 0.2); // 20% Off
    } else {
      setPromoError(true);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) return;

    setPhase("processing");
    setTimeout(() => {
      setPhase("success");
    }, 2500);
  };

  const finalTotal = Math.max(0, getCartTotal() - discountAmount);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[190]"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-[#111215] border-l border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[200] flex flex-col text-white"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#16171c]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingCart size={16} className="text-primary" />
                </div>
                <span className="font-semibold text-[15px] tracking-tight">Licensing Cart</span>
                {items.length > 0 && (
                  <span className="text-[10px] font-bold bg-primary text-black px-1.5 py-0.5 rounded-full">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/[0.05] text-neutral-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Switcher */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {phase === "cart" && (
                <>
                  {items.length === 0 ? (
                    <div className="h-[60%] flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-neutral-600">
                        <ShoppingCart size={28} />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-300">Your cart is empty</p>
                        <p className="text-[11px] text-neutral-600 mt-1 max-w-[240px] mx-auto">
                          Browse our music and sound effects catalog to add premium creator licensing licenses here.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="text-[11px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 py-2 px-5 rounded-full transition-all"
                      >
                        Browse Music
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Cart Items List */}
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-center text-[10px] text-neutral-600 font-bold uppercase tracking-wider">
                          <span>Selected Edits ({items.length})</span>
                          <button
                            onClick={clearCart}
                            className="hover:text-red-400 transition-colors flex items-center gap-1 normal-case"
                          >
                            <Trash2 size={10} /> Clear All
                          </button>
                        </div>

                        {items.map((item, idx) => (
                          <div
                            key={`${item.track.id}-${item.licenseType}-${idx}`}
                            className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl flex gap-3 relative group hover:border-white/[0.1] transition-all"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/[0.05]">
                              <img src={item.track.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-semibold truncate text-neutral-200">{item.track.title}</p>
                              <p className="text-[10px] text-neutral-500 truncate mt-0.5">{item.track.artist}</p>

                              {/* License Selector Dropdown */}
                              <div className="mt-2.5 flex items-center gap-1.5">
                                <span className="text-[9px] text-neutral-600 font-bold uppercase">License:</span>
                                <select
                                  value={item.licenseType}
                                  onChange={(e) => updateTier(item.track.id, item.licenseType, e.target.value as LicenseTier)}
                                  className="bg-white/[0.04] border border-white/[0.08] text-neutral-300 text-[10px] font-semibold rounded py-0.5 px-1.5 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/20"
                                >
                                  <option value="Personal" className="bg-[#16171c]">Personal ($29)</option>
                                  <option value="Commercial" className="bg-[#16171c]">Commercial ($99)</option>
                                  <option value="Enterprise" className="bg-[#16171c]">Enterprise ($299)</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex flex-col justify-between items-end">
                              <span className="text-[13px] font-bold text-white tabular-nums">${item.price}</span>
                              <button
                                onClick={() => removeItem(item.track.id, item.licenseType)}
                                className="p-1 rounded-md text-neutral-600 hover:text-red-400 hover:bg-white/[0.03] transition-all"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Promo Code Card */}
                      <div className="p-4 bg-white/[0.01] border border-white/[0.04] rounded-xl space-y-3">
                        <div className="flex items-center gap-2">
                          <Tag size={13} className="text-neutral-500" />
                          <span className="text-[11px] font-semibold text-neutral-400">Coupon Discount</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Try TN20 (20% Off)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            disabled={promoApplied}
                            className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg py-1.5 px-3 text-[11px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600 uppercase"
                          />
                          <button
                            onClick={handleApplyPromo}
                            disabled={promoApplied || !promoCode}
                            className="bg-white/[0.06] hover:bg-white/[0.1] text-white disabled:opacity-40 disabled:hover:bg-white/[0.06] px-3.5 rounded-lg text-[11px] font-semibold transition-all border border-white/[0.06]"
                          >
                            Apply
                          </button>
                        </div>
                        {promoApplied && (
                          <div className="text-[10px] text-primary font-semibold flex items-center gap-1 mt-1">
                            <CheckCircle2 size={10} /> Coupon successfully applied! Saved 20%
                          </div>
                        )}
                        {promoError && (
                          <div className="text-[10px] text-red-400 font-medium flex items-center gap-1 mt-1">
                            <X size={10} /> Invalid promotional code
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {phase === "checkout" && (
                <motion.form
                  onSubmit={handleCheckoutSubmit}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                    <span>Card Information</span>
                    <button
                      type="button"
                      onClick={() => setPhase("cart")}
                      className="text-primary normal-case font-semibold hover:underline"
                    >
                      Back to Cart
                    </button>
                  </div>

                  {/* Glassmorphic Credit Card visual preview */}
                  <div className="relative aspect-[1.58] w-full rounded-xl bg-gradient-to-br from-[#1b2a4a] to-[#0c0c0f] border border-white/[0.08] p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,255,0,0.06),transparent_60%)] pointer-events-none" />
                    <div className="flex justify-between items-start">
                      <CreditCard size={28} className="text-neutral-400" />
                      <span className="text-[9px] font-bold bg-white/10 text-white/80 px-2 py-0.5 rounded uppercase tracking-widest border border-white/10">SECURE CHECKSUM</span>
                    </div>
                    <div>
                      <p className="text-[15px] font-mono tracking-[0.18em] text-white/90 tabular-nums">
                        {cardNumber || "••••  ••••  ••••  ••••"}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="min-w-0 flex-1 mr-4">
                        <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">Cardholder</p>
                        <p className="text-[11px] font-mono truncate text-neutral-300 mt-0.5">{cardName || "YOUR NAME"}</p>
                      </div>
                      <div className="shrink-0 flex gap-4">
                        <div>
                          <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">Expires</p>
                          <p className="text-[11px] font-mono text-neutral-300 mt-0.5">{cardExpiry || "MM/YY"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-wider">CVV</p>
                          <p className="text-[11px] font-mono text-neutral-300 mt-0.5">{cardCvv || "•••"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form inputs */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Card Number</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4000 1234 5678 9010"
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                          setCardNumber(val);
                        }}
                        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Expiration Date</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\//g, "");
                            if (val.length > 2) {
                              val = val.substring(0, 2) + "/" + val.substring(2);
                            }
                            setCardExpiry(val);
                          }}
                          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5">Security Code (CVV)</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg py-2 px-3 text-[12px] focus:outline-none focus:ring-1 focus:ring-primary/30 text-white placeholder:text-neutral-600 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#16171c]/50 border border-white/[0.04] rounded-lg p-3 flex items-start gap-2.5 mt-2">
                    <ShieldCheck size={14} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-neutral-500 leading-normal">
                      Your details are encrypted and securely signed. Licenses are issued stateless-auth via high-grade token handshakes.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/95 text-black py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 mt-4"
                  >
                    <Lock size={13} /> Complete Checkout (${finalTotal.toFixed(2)})
                  </button>
                </motion.form>
              )}

              {phase === "processing" && (
                <div className="h-[70%] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-primary">
                    <RefreshCw size={24} className="animate-spin" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-200">Securing Payment...</p>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-[200px] mx-auto">
                      Performing stateless JWT authorization and generating licensing contracts.
                    </p>
                  </div>
                </div>
              )}

              {phase === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[75%] flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative">
                    <CheckCircle2 size={32} />
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-2xl border border-primary/40"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-[18px] text-white">Purchase Confirmed!</h4>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-[260px] mx-auto">
                      Your licenses have been verified and activated. Licensing contracts have been mailed to your account.
                    </p>
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 w-full text-left space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-500 font-bold uppercase">
                      <span>Transaction Code</span>
                      <span className="font-mono text-neutral-400">TXN-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                    <div className="h-px bg-white/[0.04]" />
                    <div className="space-y-1.5">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-[11px] font-medium">
                          <span className="text-neutral-400 truncate max-w-[200px]">{item.track.title}</span>
                          <span className="text-primary font-semibold text-[10px] bg-primary/10 px-1.5 py-0.5 rounded uppercase">{item.licenseType}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      clearCart();
                      setIsOpen(false);
                      setPhase("cart");
                      setPromoCode("");
                      setPromoApplied(false);
                      setDiscountAmount(0);
                    }}
                    className="w-full bg-white hover:bg-white/90 text-black py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Done & Return
                  </button>
                </motion.div>
              )}
            </div>

            {/* Sticky Total Footer */}
            {items.length > 0 && phase === "cart" && (
              <div className="p-5 border-t border-white/[0.06] bg-[#16171c] shrink-0 space-y-4">
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between text-neutral-500 font-medium">
                    <span>Subtotal</span>
                    <span className="text-neutral-300 tabular-nums">${getCartTotal().toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-primary font-medium">
                      <span>Discount (20%)</span>
                      <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[14px] font-bold text-white pt-1">
                    <span>Grand Total</span>
                    <span className="text-primary tabular-nums">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setPhase("checkout")}
                  className="w-full bg-primary hover:bg-primary/95 text-black py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                >
                  Proceed to Checkout <ChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
