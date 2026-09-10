'use client'

import { useState } from 'react'
import { Settings, Mail, Phone, MapPin, Instagram, Youtube } from 'lucide-react'

export function SettingsPanel() {
  const [storeName, setStoreName] = useState('Dream Frame')
  const [slogan, setSlogan] = useState('L\'Art de Capturer l\'Exceptionnel')
  const [email, setEmail] = useState('contact@dreamframe.fr')
  const [phone, setPhone] = useState('+33 6 00 00 00 00')
  const [address, setAddress] = useState('Atelier Dream Frame, 75008 Paris, France')
  const [instagram, setInstagram] = useState('https://instagram.com/dreamframe')
  const [tiktok, setTiktok] = useState('https://tiktok.com/@dreamframe')

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-600" />
          Paramètres de Base
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Identité de la boutique, coordonnées officielles et liens vers vos réseaux.
        </p>
      </div>

      {/* Brand info */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Identité de Marque</h3>

        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500">Nom du site</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500">Slogan / Tagline</label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coordonnées Atelier</h3>

        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-slate-400" />
              Email de Contact Client
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-400" />
              Téléphone Support
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              Adresse de l&apos;Atelier
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Social networks */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Réseaux Sociaux</h3>

        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <Instagram className="w-3 h-3 text-red-500" />
              Lien Instagram
            </label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-700">TikTok</span>
              Lien TikTok
            </label>
            <input
              type="url"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
