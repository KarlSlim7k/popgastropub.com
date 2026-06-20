"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  fetchPublicTiers,
  fetchPublicPointActions,
  Tier,
  PointAction,
} from "@/lib/loyalty";
import { fetchPublicRecompensas, Recompensa } from "@/lib/recompensas";
import Hero from "@/components/pop-points/Hero";
import HowItWorks from "@/components/pop-points/HowItWorks";
import EarnPoints from "@/components/pop-points/EarnPoints";
import Tiers from "@/components/pop-points/Tiers";
import Rewards from "@/components/pop-points/Rewards";
import CompareTable from "@/components/pop-points/CompareTable";
import FAQ from "@/components/pop-points/FAQ";
import FinalCTA from "@/components/pop-points/FinalCTA";

const DEFAULT_WELCOME_PTS = 50;

export default function PuntosPage() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [actions, setActions] = useState<PointAction[]>([]);
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [t, a, r] = await Promise.all([
          fetchPublicTiers(),
          fetchPublicPointActions(),
          fetchPublicRecompensas(),
        ]);
        if (cancelled) return;
        setTiers(t);
        setActions(a);
        setRecompensas(r);
      } catch {
        if (!cancelled) {
          setTiers([]);
          setActions([]);
          setRecompensas([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const welcomeAction = actions.find((a) => a.slug === "welcome");
  const welcomePoints = welcomeAction?.points ?? DEFAULT_WELCOME_PTS;
  const earnActions = actions.filter((a) => a.slug !== "welcome");

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center pt-16">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="text-[#F2C777] text-sm font-black uppercase tracking-[0.4em]"
        >
          POP Points
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-16">
      <Hero welcomePoints={welcomePoints} tiers={tiers} />
      <HowItWorks />
      <EarnPoints actions={earnActions} welcomePoints={welcomePoints} />
      <Tiers tiers={tiers} />
      <Rewards recompensas={recompensas} />
      <CompareTable tiers={tiers} />
      <FAQ />
      <FinalCTA welcomePoints={welcomePoints} />
    </main>
  );
}
