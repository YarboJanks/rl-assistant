import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">RL Assistant</h1>
          <span className="text-gray-400 text-sm">{session.user.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">My Raids</h2>
            <p className="text-gray-500 text-sm">No raids yet. Create your first raid.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-2">Build Templates</h2>
            <p className="text-gray-500 text-sm">No builds yet. Create a build template.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
