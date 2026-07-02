"use client"
import React from "react";

export interface CardData {
  id: string;
  bankName: string;
  cardType: "visa" | "mastercard" | "amex";
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  colorClass: string;
  glowClass: string;
}

const MOCK_CARDS: CardData[] = [
  {
    id: "card-1",
    bankName: "HDFC Bank",
    cardType: "visa",
    cardNumber: "•••• •••• •••• 9012",
    cardHolder: "KIRAN KUMAR",
    expiry: "09/29",
    colorClass: "from-[#1c355e] to-[#0c182e]",
    glowClass: "shadow-[0_0_15px_rgba(28,53,94,0.3)]",
  },
  {
    id: "card-2",
    bankName: "Axis Bank",
    cardType: "mastercard",
    cardNumber: "•••• •••• •••• 3456",
    cardHolder: "KIRAN KUMAR",
    expiry: "12/28",
    colorClass: "from-[#4e122d] to-[#270614]",
    glowClass: "shadow-[0_0_15px_rgba(78,18,45,0.3)]",
  },
  {
    id: "card-3",
    bankName: "Antigravity Bank",
    cardType: "amex",
    cardNumber: "•••• •••• ••••• 7894",
    cardHolder: "KIRAN KUMAR",
    expiry: "05/31",
    colorClass: "from-[#0f2c3d] to-[#051119]",
    glowClass: "shadow-[0_0_15px_rgba(15,44,61,0.3)]",
  }
];

interface SavedCardsProps {
  onSelectCard: (_bankName: string) => void;
  selectedBank: string;
}

export function SavedCards({ onSelectCard, selectedBank }: SavedCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">
          Quick-select Saved Card
        </label>
        <span className="text-[10px] text-[#adc7ff] font-bold cursor-pointer hover:underline">
          Manage
        </span>
      </div>

      {/* Horizontal Scrollable Slider */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {MOCK_CARDS.map((card) => {
          const isSelected = selectedBank === card.bankName;
          
          return (
            <div
              key={card.id}
              onClick={() => onSelectCard(card.bankName)}
              className={`snap-center shrink-0 w-60 h-32 rounded-2xl bg-gradient-to-br ${card.colorClass} ${card.glowClass} p-3.5 flex flex-col justify-between border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isSelected 
                  ? "border-[#adc7ff] scale-[1.01] ring-1 ring-[#adc7ff]/30" 
                  : "border-white/10 opacity-60 hover:opacity-85"
              }`}
            >
              {/* Card shape glow */}
              <div className="absolute right-0 bottom-0 -mr-6 -mb-6 w-20 h-20 rounded-full bg-white/5 blur-xl"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold tracking-wide text-white">{card.bankName}</p>
                  <p className="text-[7px] text-white/40 font-mono">SIGNATURE CARD</p>
                </div>
                {/* Logo Symbol */}
                <div className="w-8 h-4.5 flex items-center justify-center bg-white/10 rounded text-[8px] font-extrabold text-white/80 uppercase">
                  {card.cardType}
                </div>
              </div>

              {/* Number */}
              <div>
                <p className="font-mono text-xs tracking-widest text-white/90">{card.cardNumber}</p>
              </div>

              {/* Holder & Expiry */}
              <div className="flex justify-between items-end text-[7px] text-white/50 font-medium">
                <div>
                  <p className="text-[5px] text-white/30 uppercase">Card Holder</p>
                  <p>{card.cardHolder}</p>
                </div>
                <div className="text-right">
                  <p className="text-[5px] text-white/30 uppercase">Expires</p>
                  <p>{card.expiry}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
