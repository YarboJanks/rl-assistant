export type Role = "tank" | "healer" | "dps"

export interface GearSlot {
  slot: string
  itemId: number
  quality: number
  trait: string
  enchant: string
}

export interface SkillSlot {
  slot: number
  abilityId: number
}

export interface Build {
  id: string
  name: string
  role: Role
  class: string
  gear: GearSlot[]
  skills: SkillSlot[]
  cp: Record<string, number>
  createdAt: string
  updatedAt: string
}

export interface RosterEntry {
  id: string
  raidId: string
  discordId: string
  displayName: string
  role: Role
  buildId: string | null
  build?: Build
}

export interface Raid {
  id: string
  name: string
  description: string | null
  leaderId: string
  date: string | null
  roster: RosterEntry[]
  createdAt: string
  updatedAt: string
}
