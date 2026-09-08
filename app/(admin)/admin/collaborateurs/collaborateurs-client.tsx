'use client'

import { useState } from 'react'
import {
  Users,
  UserPlus,
  Trash2,
  ShieldCheck,
  Package,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  DatabaseZap,
} from 'lucide-react'
import {
  createCollaboratorAction,
  removeCollaboratorAction,
  clearMockDataAction,
} from './actions'
import type { StoredCollaborator } from '@/lib/data-store'

const ROLE_CONFIG = {
  ADMIN: {
    label: 'Administrateur',
    desc: 'Accès complet au catalogue, aux finances, aux stocks et aux paramètres',
    icon: ShieldCheck,
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  LOGISTICS: {
    label: 'Préparateur Logistique',
    desc: 'Accès aux commandes, gestion des stocks et impression des bordereaux Colissimo',
    icon: Package,
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  SUPPORT: {
    label: 'Support Client',
    desc: 'Consultation des commandes et suivi des livraisons clients',
    icon: Headphones,
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
}

export function CollaborateursClient({
  initialCollaborators,
}: {
  initialCollaborators: StoredCollaborator[]
}) {
  const [collaborators, setCollaborators] = useState<StoredCollaborator[]>(initialCollaborators)
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'LOGISTICS' | 'SUPPORT'>('ADMIN')
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [purging, setPurging] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    setLoading(true)
    setStatusMsg(null)

    const res = await createCollaboratorAction({ name, email, role })
    if (res.success && res.collaborator) {
      setCollaborators((prev) => [...prev, res.collaborator!])
      setName('')
      setEmail('')
      setShowAddForm(false)
      setStatusMsg({ type: 'success', text: `Collaborateur ${name} ajouté avec succès.` })
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Erreur lors de l’ajout.' })
    }
    setLoading(false)
  }

  const handleRemove = async (id: string, collabName: string) => {
    if (!confirm(`Supprimer l'accès de ${collabName} ?`)) return
    const res = await removeCollaboratorAction(id)
    if (res.success) {
      setCollaborators((prev) => prev.filter((c) => c.id !== id))
      setStatusMsg({ type: 'success', text: `Accès de ${collabName} supprimé.` })
    }
  }

  const handlePurgeMockData = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer les données d’essai pour ne conserver que 100% de vraies données ?')) {
      return
    }
    setPurging(true)
    const res = await clearMockDataAction()
    setStatusMsg({
      type: res.success ? 'success' : 'error',
      text: res.message || 'Données mises à jour.',
    })
    setPurging(false)
  }

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
              Équipe &amp; Collaborateurs
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les accès à l&apos;espace administrateur pour votre frère, associés ou préparateurs de commande
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showAddForm ? 'Fermer' : 'Ajouter un Collaborateur'}</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Formulaire d'Ajout */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-600" />
              Nouveau Collaborateur
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Prise en main immédiate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Nom &amp; Prénom
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Arthur (Frère)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Email professionnel
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arthur@dreamframe.fr"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Rôle attribué
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 transition"
              >
                <option value="ADMIN">Administrateur (Accès total)</option>
                <option value="LOGISTICS">Préparateur Logistique (Stocks &amp; Commandes)</option>
                <option value="SUPPORT">Support Client (Commandes &amp; Clients)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
              Créer l&apos;Accès
            </button>
          </div>
        </form>
      )}

      {/* Table des Collaborateurs */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Membres Actifs ({collaborators.length})
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Connexion sécurisée</span>
        </div>

        <div className="divide-y divide-slate-100">
          {collaborators.map((collab) => {
            const roleConf = ROLE_CONFIG[collab.role] || ROLE_CONFIG.ADMIN
            const RoleIcon = roleConf.icon

            return (
              <div
                key={collab.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm flex-shrink-0">
                    {collab.name[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 text-sm">{collab.name}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Actif
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{collab.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border ${roleConf.badge}`}
                    >
                      <RoleIcon className="w-3.5 h-3.5" />
                      {roleConf.label}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-xs hidden md:block">
                      {roleConf.desc}
                    </p>
                  </div>

                  {collab.email !== 'admin@dreamframe.fr' && (
                    <button
                      type="button"
                      onClick={() => handleRemove(collab.id, collab.name)}
                      title="Supprimer l'accès"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section Mode Données Réelles Uniquement */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <DatabaseZap className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Gestion de la Clarté des Données (Zéro Fake Data)
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            100% Données Réelles
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-light">
          Vous souhaitez ne voir **que les vraies commandes passées par vos clients** et réinitialiser les chiffres de démonstration ? Cliquez ci-dessous pour nettoyer l&apos;historique de test. Les données réelles ne sont jamais altérées.
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-400">
            Cette action supprime les commandes fictives d&apos;essai et conserve l&apos;ensemble du catalogue et des stocks.
          </span>
          <button
            type="button"
            onClick={handlePurgeMockData}
            disabled={purging}
            className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs uppercase tracking-wider rounded-xl transition border border-slate-200 hover:border-rose-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {purging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <DatabaseZap className="w-3.5 h-3.5" />}
            Purger les données d&apos;essai
          </button>
        </div>
      </div>
    </div>
  )
}
